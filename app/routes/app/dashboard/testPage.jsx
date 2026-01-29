import useEnrollment from "../../../queries/enrollment";

export default function TestPage() {
  const { data, isLoading } = useEnrollment("6977a624ec5bb162fce05d67");

  if (isLoading) return <div>Loading...</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
