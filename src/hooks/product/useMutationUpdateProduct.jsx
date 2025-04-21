import { useMutation } from "@tanstack/react-query"
import axiosInstance, { endpoints } from "src/utils/axios"

export const useMutationUpdateProduct = ({ onSuccess, onError }) => {
    return useMutation({
        mutationKey: ["edit.product"],
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.post(
                `${endpoints.product.update}/${id}`,
                data
            )
            return response.data
        },
        onSuccess,
        onError,
    })
}