import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

const getHeaders = (payload) =>
  payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};

export const useApiQuery = ({ endpoint, params = {}, key, enabled = true }) =>
  useQuery({
    queryKey: [key || endpoint, params],
    enabled,
    queryFn: () => api.get(endpoint, { params }).then((r) => r.data),
  });

export const useApiQueryById = ({ endpoint, id, key, enabled = true }) =>
  useQuery({
    queryKey: [key || endpoint, id],
    enabled: enabled && !!id,
    queryFn: () => api.get(`${endpoint}/${id}`).then((r) => r.data),
  });

export const useApiMutation = ({ endpoint, method = 'POST', invalidate = [] }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api[method.toLowerCase()](endpoint, payload, { headers: getHeaders(payload) }).then((r) => r.data),
    onSuccess: () => invalidate.forEach((k) => queryClient.invalidateQueries({ queryKey: [k] })),
  });
};

export const useApiMutationById = ({ endpoint, method = 'PUT', invalidate = [] }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api[method.toLowerCase()](`${endpoint}/${id}`, payload, { headers: getHeaders(payload) }).then((r) => r.data),
    onSuccess: (_, { id }) => {
      invalidate.forEach((k) => {
        queryClient.invalidateQueries({ queryKey: [k] });
        queryClient.invalidateQueries({ queryKey: [k, id] });
      });
    },
  });
};

export const useApiDelete = ({ endpoint, invalidate = [] }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${endpoint}/${id}`).then((r) => r.data),
    onSuccess: () => invalidate.forEach((k) => queryClient.invalidateQueries({ queryKey: [k] })),
  });
};
