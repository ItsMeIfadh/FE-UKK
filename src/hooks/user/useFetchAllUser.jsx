import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchAllUser = () =>
  useQuery({
    queryKey: ['fetch.all.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.user.list);
      console.log(response);
      return response.data;
    },
  });
