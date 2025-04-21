import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllCategory = () =>
  useQuery({
    queryKey: ['fetch.categories'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.kategori.list);
      console.log(response);
      return response.data.data;
    },
  });