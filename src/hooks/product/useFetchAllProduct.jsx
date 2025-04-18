import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllProduct = () =>
  useQuery({
    queryKey: ['chart.products'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.product.list);
      console.log(response.data);
      return response.data;
    },
  });