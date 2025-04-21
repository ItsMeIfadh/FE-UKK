import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateProduct = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.product'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.product.create, data);
      return response.data;
    },
    onSuccess,
    onError,
  });
}