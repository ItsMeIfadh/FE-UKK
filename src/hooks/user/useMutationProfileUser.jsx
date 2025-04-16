// src/hooks/user/useMutationProfileUser.js

import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationProfileUser = ({ onSuccess,
  onError }) =>
  useMutation({
    mutationKey: ['profile'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.user.update, data);
      return response.data;
    },
    onSuccess,
    onError
  });
