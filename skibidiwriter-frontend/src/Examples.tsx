import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

export default function Examples() {
  const { isPending, error, data } = useQuery({
    queryKey: ["examples.list"],
    queryFn: async () => {
      const res = await api.examples.$get();
      if (!res.ok) return null;

      return await res.json();
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      {data?.map((example) => (
          <div key={example.id}>
            <h1>{example.id}</h1>
            <p>{example.name}</p>
          </div>
      ))}
    </div>
  );
}
