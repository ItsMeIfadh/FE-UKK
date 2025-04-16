import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteUser = ({ onError, onSuccess }) =>
    useMutation({
        mutationKey: ['delete.user'],
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`${endpoints.user.delete}/${id}`);
            return response.data;
        },
        onSuccess,
        onError,
    });
