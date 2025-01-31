import { useQuery } from "@tanstack/react-query";
import { AggregatedResponseDTO, PaginatedResponse } from "../dto/Response";
import { baseUrl } from "./common";

export const responsePageSize = 10;

export const fetchResponses = async (formId: string, page: number, pageSize: number): Promise<PaginatedResponse> => {
  const response = await fetch(
    `${baseUrl}form/${formId}/responses?page=${page}&pageSize=${pageSize}`,
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

const fetchAggregatedResponses = async (formId: string): Promise<AggregatedResponseDTO> => {
   const response = await fetch(
    `${baseUrl}form/${formId}/responses/aggregated`,
    { credentials: 'include' }
  );
  if (!response.ok) throw new Error('Failed to fetch aggregated responses');
  const data = await response.json();
  return data;
};

export const useAggregatedResponses = (formId: string) => {
  return useQuery<AggregatedResponseDTO>({
    queryKey: ["aggregatedResponses", formId],
    queryFn: () => fetchAggregatedResponses(formId)
  });
};