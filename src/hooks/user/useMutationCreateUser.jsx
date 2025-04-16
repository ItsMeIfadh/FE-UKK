import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationCreateUser = ({ onError, onSuccess }) =>
    useMutation({
        mutationKey: ['create.user'],
        mutationFn: async (data) => {
            const response = await axiosInstance.post(endpoints.user.create, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
