import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationDeleteProduct = ({ onSuccess, onError }) => {
    return useMutation({
        mutationKey: ['delete.product'],
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`${endpoints.product.delete}/${id}`);
            return response.data;
        },
        onSuccess,
        onError,
    });
}