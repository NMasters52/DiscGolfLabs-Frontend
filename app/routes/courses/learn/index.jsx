import { useOutletContext } from "react-router";

export default function LearnIndex() {
  const { course, enrollment } = useOutletContext();

  return (
    <div>
      <h1>{course.title}</h1>
      <p>You are enrolled.</p>
      <p>Current day: {enrollment.currentDay}</p>
    </div>
  );
}
