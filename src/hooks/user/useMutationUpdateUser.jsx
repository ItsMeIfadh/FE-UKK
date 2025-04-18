import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUpdateUser = ({ onSuccess, onError }) => {
    return useMutation({
        mutationKey: ['edit.user'],
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.post(`${endpoints.user.update}/${id}`, data);
            return response.data;
        },
        onSuccess,
        onError,
    });
};
