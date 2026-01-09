import { useApiFetch } from "@/hooks/useApiFetch";

export default function DashboardPage() {
  const { data, loading, error, fetchData } = useApiFetch("/todos/1");

  return (
    <div>
      <p>Welcome to your app!</p>
      <p>{data}</p>
    </div>
  );
}
