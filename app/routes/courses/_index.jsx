import { useParams, useNavigate } from "react-router";
import { useAuth, useSession } from "@clerk/react-router";
import { SignInButton } from "@clerk/react-router";
import useCourse from "../../queries/useCourse";
import useEnrollment from "../../queries/useEnrollment";
import { createCheckoutSession } from "../../api/checkout";

export default function CourseSalesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { session } = useSession();

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

  const handleBuy = async () => {
    try {
      const token = await session.getToken();
      const { url } = await createCheckoutSession(token, slug);

      window.location.href = url;
      console.log(url);
    } catch (err) {
      console.error(err);
    }
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
