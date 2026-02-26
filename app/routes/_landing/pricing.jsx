import useCourses from "../../queries/useCourses";

export default function PricingPage() {
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error.message}</div>;
  if (!courses || courses.length === 0) return <div>No courses available</div>;

  return (
    <div>
      <h1>Pricing</h1>
      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>Price: ${(course.priceInCents / 100).toFixed(2)}</p>
          <p>Total Days: {course.totalDays}</p>
          <a href={`/courses/${course.slug}`}>View Course</a>
        </div>
      ))}
    </div>
  );
}
