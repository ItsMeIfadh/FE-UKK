import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchProductById = (id) =>
  useQuery({
    queryKey: ['product', id], // Key query menjadi dinamis berdasarkan ID
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.product.details}/${id}`);
      console.log(response)
      return response.data;
    },
  });
