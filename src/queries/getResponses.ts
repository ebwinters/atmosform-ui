import { useQuery, QueryFunction } from "@tanstack/react-query";
import { PaginatedResponse } from "../dto/Response";

const fetchResponses: QueryFunction<PaginatedResponse, readonly unknown[]> = async ({ queryKey }) => {
  const [, formId, page, pageSize] = queryKey as [string, string, number, number]; // Ensure correct typing

  const response = await fetch(
    `http://127.0.0.1:3333/api/v1/form/${formId}/responses?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch responses");
  }

  return response.json(); // Ensure response type safety
};

const usePaginatedResponses = (formId: string, page: number, pageSize: number = 10) => {
  return useQuery<PaginatedResponse, Error, PaginatedResponse, readonly [string, string, number, number]>({
    queryKey: ["responses", formId, page, pageSize] as const, // `as const` ensures readonly array
    queryFn: fetchResponses, // Now correctly typed
    staleTime: 1000 * 60 * 5, // Optional: Keep data fresh for 5 minutes
  });
};

export default usePaginatedResponses;
