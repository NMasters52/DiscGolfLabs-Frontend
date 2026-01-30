import useCourse from "../../../queries/useCourse";

export default function TestPage() {
  const { data, isLoading } = useCourse("putting-course");

  if (isLoading) return <div>Loading...</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
