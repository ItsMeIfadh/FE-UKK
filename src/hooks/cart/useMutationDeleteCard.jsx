import { useMutation } from "@tanstack/react-query"
import axiosInstance, { endpoints } from "src/utils/axios"


export const useMutationDeleteCard = ({ onSuccess,
    onError }) => useMutation({
        mutationKey: ['deleted,cart'],
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`${endpoints.cart.delete}/${id}`)
            return response.data
        },
        onSuccess,
        onError
    })