import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "../dto/Response";

export const responsePageSize = 10;

export const fetchResponses = async (formId: string, page: number, pageSize: number): Promise<PaginatedResponse> => {
  const response = await fetch(
    `http://127.0.0.1:3333/api/v1/form/${formId}/responses?page=${page}&pageSize=${pageSize}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to fetch responses');

  const data = await response.json();
  return data as PaginatedResponse;
};

export const useResponsesQuery = (formId: string, responsePage: number, shouldPopulateData: boolean) => {
  return useQuery({
    queryKey: ['responses', formId, responsePage],
    queryFn: () => fetchResponses(formId, responsePage, responsePageSize),
    enabled: shouldPopulateData,
    placeholderData: (prev) => prev,
  });
};