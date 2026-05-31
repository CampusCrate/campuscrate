import { useQuery } from "@tanstack/react-query";

export interface University {
  id: string;
  name: string;
  slug: string;
}

export function useUniversities() {
  return useQuery<University[]>({
    queryKey: ["universities"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:8000/api/v1/universities/");
      if (!res.ok) throw new Error("Failed to fetch universities");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 mins — universities don't change often
  });
}
