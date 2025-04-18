// src/hooks/product/useMutationCreateProduct.js
import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

/**
 * Hook untuk membuat produk baru melalui endpoint API.
 * Menggunakan React Query useMutation.
 *
 * @param {Function} onSuccess - Callback saat request berhasil.
 * @param {Function} onError - Callback saat request gagal.
 *
 * @returns {Object} - Object useMutation (mutate, status, etc.)
 */
export const useMutationCreateProduct = ({ onSuccess, onError }) =>
  useMutation({
    mutationKey: ['create.product'],
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post(endpoints.product.create, data);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Gagal membuat produk');
      }
    },
    onSuccess,
    onError,
  });
