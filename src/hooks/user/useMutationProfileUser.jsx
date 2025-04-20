// src/hooks/user/useMutationProfileUser.js
import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationProfileUser = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['profile'], // untuk caching dan tracking data profile
    mutationFn: async (data) => {
      const response = await axiosInstance.put(endpoints.auth.meUpdate, data);
      return response.data;
    },
    onSuccess, // fungsi callback jika berhasil
    onError,   // fungsi callback jika gagal
  });

