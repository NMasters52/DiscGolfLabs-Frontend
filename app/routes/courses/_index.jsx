import { useParams, useNavigate } from "react-router";
import { useAuth } from "@clerk/react-router";
import { SignInButton } from "@clerk/react-router";
import useCourse from "../../queries/useCourse";
import useEnrollment from "../../queries/useEnrollment";

export default function CourseSalesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const { data: course, isLoading: courseLoading } = useCourse(slug);
  const { data: enrollment, isLoading: enrollmentLoading } = useEnrollment(
    course?._id,
    {
      enabled: isSignedIn,
    },
  );

  if (courseLoading) return <div>Loading course...</div>;
  if (!course) return <div>Course not found</div>;

  const isEnrolled = enrollment?.enrolled;
  const checkingEnrollment = isSignedIn && enrollmentLoading;

  const handleBuy = async () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }

    // We'll wire this up next
    console.log("TODO: trigger checkout for", course.slug);
  };

  const handleContinue = () => {
    navigate(`/courses/${slug}/learn`);
  };

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>${(course.priceInCents / 100).toFixed(2)}</p>

      <h2>What you'll learn</h2>
      <ul>
        {course.days.map((day) => (
          <li key={day.dayNumber}>
            <strong>
              Day {day.dayNumber}: {day.title}
            </strong>
            <p>{day.description}</p>
          </li>
        ))}
      </ul>

      {!isSignedIn ? (
        <SignInButton mode="redirect" forceRedirectUrl={`/courses/${slug}`}>
          <button>Sign in to buy</button>
        </SignInButton>
      ) : isEnrolled ? (
        <button onClick={handleContinue}>Continue Learning</button>
      ) : (
        <button onClick={handleBuy}>Buy Now</button>
      )}
    </div>
  );
}
