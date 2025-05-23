import { useMutation } from "@tanstack/react-query"
import axiosInstance, { endpoints } from "src/utils/axios"

export const useMutationAddToCart = ({ onSuccess,
    onError }, id) => useMutation({
        mutationKey: ['mutate.cart'],
        mutationFn: async () => {
            const response = await axiosInstance.post(endpoints.cart.add, {
                product_id: id
            })
            return response.data
        },
        onSuccess,
        onError
    })