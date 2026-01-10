import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Reusable TanStack Query adapter for API calls
 * Provides a consistent interface for queries and mutations with error handling
 */

/**
 * Custom hook for queries with automatic error handling
 * @param {string|array} queryKey - Query key or array of keys
 * @param {function} queryFn - Function that returns a promise
 * @param {object} options - Additional query options (enabled, staleTime, etc.)
 * @returns {object} Query result with data, loading, error, refetch, etc.
 */
export const useQueryAdapter = (queryKey, queryFn, options = {}) => {
  const {
    enabled = true,
    staleTime = 0,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    onError,
    showErrorToast = true,
    ...restOptions
  } = options;

  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        const response = await queryFn();
        // axiosClient already returns response.data from interceptor
        // If response has a data property, use it; otherwise use response directly
        return response?.data !== undefined ? response.data : response;
      } catch (error) {
        if (showErrorToast) {
          const errorMessage =
            error?.response?.data?.error || error?.message || "Error al cargar los datos";
          toast.error(errorMessage);
        }
        if (onError) {
          onError(error);
        }
        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime: cacheTime, // TanStack Query v5 uses gcTime instead of cacheTime
    refetchOnWindowFocus,
    refetchOnMount,
    ...restOptions,
  });
};

/**
 * Custom hook for mutations with automatic error handling and success notifications
 * @param {function} mutationFn - Function that performs the mutation
 * @param {object} options - Additional mutation options
 * @returns {object} Mutation object with mutate, mutateAsync, isLoading, etc.
 */
export const useMutationAdapter = (mutationFn, options = {}) => {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    invalidateQueries = [],
    ...restOptions
  } = options;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      try {
        const response = await mutationFn(variables);
        // axiosClient already returns response.data from interceptor
        return response?.data !== undefined ? response.data : response;
      } catch (error) {
        if (showErrorToast) {
          const errorMsg =
            error?.response?.data?.error || error?.message || errorMessage || "Error en la operación";
          toast.error(errorMsg);
        }
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      // Invalidate queries if specified
      if (Array.isArray(invalidateQueries) && invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          });
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...restOptions,
  });
};

/**
 * Helper to create query key factory
 * @param {string} baseKey - Base key for the resource
 * @returns {object} Object with methods to create query keys
 */
export const createQueryKeyFactory = (baseKey) => ({
  all: [baseKey],
  lists: () => [...createQueryKeyFactory(baseKey).all, "list"],
  list: (filters) => [...createQueryKeyFactory(baseKey).lists(), { filters }],
  details: () => [...createQueryKeyFactory(baseKey).all, "detail"],
  detail: (id) => [...createQueryKeyFactory(baseKey).details(), id],
});

