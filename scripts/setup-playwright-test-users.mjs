import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../DiscGolfLabs-api");
process.loadEnvFile(path.join(apiRoot, ".env"));
const requireApi = createRequire(path.join(apiRoot, "package.json"));
const clerkClient = requireApi("@clerk/clerk-sdk-node");
const mongoose = requireApi("mongoose");
const { Course } = await import(pathToFileURL(path.join(apiRoot, "src/models/Course.js")));
const { Enrollment } = await import(pathToFileURL(path.join(apiRoot, "src/models/Enrollment.js")));
const { User } = await import(pathToFileURL(path.join(apiRoot, "src/models/User.js")));

const accounts = [
  {
    key: "FREE",
    name: "John Doe",
    email: process.env.PLAYWRIGHT_FREE_EMAIL,
    clerkUserId: process.env.PLAYWRIGHT_FREE_CLERK_USER_ID,
  },
  {
    key: "PAID",
    name: "Jane Doe",
    email: process.env.PLAYWRIGHT_PAID_EMAIL,
    clerkUserId: process.env.PLAYWRIGHT_PAID_CLERK_USER_ID,
  },
];

for (const account of accounts) {
  if (!account.email || !account.clerkUserId) {
    throw new Error(`Missing PLAYWRIGHT_${account.key}_EMAIL or Clerk user ID.`);
  }
  if (!account.email.includes("+clerk_test@")) {
    throw new Error(`${account.name}'s email must use Clerk's +clerk_test pattern.`);
  }
}

if (accounts[0].email === accounts[1].email) {
  throw new Error("The free and paid accounts must use different emails.");
}
if (accounts[0].clerkUserId === accounts[1].clerkUserId) {
  throw new Error("The free and paid accounts must use different Clerk user IDs.");
}
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from DiscGolfLabs-api/.env.");
}
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is missing from DiscGolfLabs-api/.env.");
}

if (!process.env.CLERK_SECRET_KEY.startsWith("sk_test_")) {
  throw new Error("Test-user setup requires a Clerk development secret key.");
}

const clerkUsers = [];
for (const account of accounts) {
  let response;
  try {
    response = await clerkClient.users.getUserList({
      emailAddress: [account.email],
      limit: 10,
    });
  } catch (error) {
    throw error;
  }
  const listedUsers = response.data ?? response;
  const matches = listedUsers.filter((user) =>
    user.emailAddresses.some(({ emailAddress }) => emailAddress === account.email),
  );
  if (matches.length !== 1) {
    throw new Error(
      `Expected one Clerk user for ${account.name} at ${account.email}, found ${matches.length}. Check the development instance in Clerk. No MongoDB records have been changed.`,
    );
  }
  const clerkUser = matches[0];
  if (clerkUser.id !== account.clerkUserId) {
    throw new Error(
      `The saved Clerk ID for ${account.name} does not match the current user found by ${account.email}. Rerun the frontend wizard and replace the saved ID. No MongoDB records have been changed.`,
    );
  }
  const emails = clerkUser.emailAddresses.map(({ emailAddress }) => emailAddress);
  if (!emails.includes(account.email)) {
    throw new Error(`${account.clerkUserId} does not belong to ${account.email}. Check the Clerk instance and copied ID.`);
  }
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  if (name !== account.name) {
    throw new Error(`${account.clerkUserId} is named "${name}", expected "${account.name}".`);
  }
  clerkUsers.push(clerkUser);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);

  const course = await Course.findOne({ slug: "putting-course" });
  if (!course) {
    throw new Error('Course "putting-course" is missing. Seed the course, then rerun this script.');
  }

  for (const account of accounts) {
    const conflictingUser = await User.findOne({
      email: account.email,
      clerkUserId: { $ne: account.clerkUserId },
    });
    if (conflictingUser) {
      throw new Error(`${account.email} is already attached to a different Clerk user.`);
    }
  }

  const existingFreeUser = await User.findOne({
    clerkUserId: accounts[0].clerkUserId,
  });
  if (existingFreeUser) {
    const existingFreeEnrollment = await Enrollment.findOne({
      user: existingFreeUser._id,
      course: course._id,
      status: "active",
    });
    if (existingFreeEnrollment) {
      throw new Error("John already has an active putting-course enrollment. No records were changed.");
    }
  }

  const [freeUser, paidUser] = await Promise.all(
    accounts.map((account) =>
      User.findOneAndUpdate(
        { clerkUserId: account.clerkUserId },
        {
          $set: { email: account.email, name: account.name },
          $setOnInsert: { clerkUserId: account.clerkUserId },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const paidEnrollments = await Enrollment.find({
    user: paidUser._id,
    course: course._id,
  });
  if (paidEnrollments.length > 1) {
    throw new Error("Jane has multiple putting-course enrollment records. Resolve the duplicates before rerunning.");
  }

  const paidEnrollment = await Enrollment.findOneAndUpdate(
    { user: paidUser._id, course: course._id },
    {
      $set: { status: "active", purchaseType: "lifetime" },
      $setOnInsert: { currentDay: 1 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const freeEnrollment = await Enrollment.findOne({
    user: freeUser._id,
    course: course._id,
    status: "active",
  });
  if (freeEnrollment) {
    throw new Error("John has an active putting-course enrollment after setup.");
  }
  if (paidEnrollment.status !== "active") {
    throw new Error("Jane's putting-course enrollment is not active after setup.");
  }

  console.log("Free account: John Doe, no active putting-course enrollment.");
  console.log("Paid account: Jane Doe, active putting-course enrollment.");
} finally {
  await mongoose.disconnect();
}
