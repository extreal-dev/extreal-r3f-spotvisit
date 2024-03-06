/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * openapi
 * OpenAPI spec version: 1.0
 */
import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type { SpotResponse } from ".././model";
import { backendCustomInstance } from "../../libs/backend/customInstance";
import type { ErrorType } from "../../libs/backend/customInstance";

/**
 * @summary Get Spot information List
 */
export const getSpots = (signal?: AbortSignal) => {
  return backendCustomInstance<SpotResponse[]>({
    url: `/spots`,
    method: "GET",
    signal,
  });
};

export const getGetSpotsQueryKey = () => {
  return [`/spots`] as const;
};

export const getGetSpotsQueryOptions = <
  TData = Awaited<ReturnType<typeof getSpots>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSpots>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSpotsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpots>>> = ({
    signal,
  }) => getSpots(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSpots>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetSpotsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSpots>>
>;
export type GetSpotsQueryError = ErrorType<unknown>;

/**
 * @summary Get Spot information List
 */
export const useGetSpots = <
  TData = Awaited<ReturnType<typeof getSpots>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSpots>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetSpotsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
