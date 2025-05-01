import { useMutation } from "@tanstack/react-query"
import axiosInstance, { endpoints } from "src/utils/axios"

export const useMutationPaymentProduct = ({ onSuccess,
    onError }, id) => useMutation({
        mutationKey: ['mutate.cart.checkout'],
        mutationFn: async () => {
            const response = await axiosInstance.post(endpoints.cart.checkout, {
                product_id: id
            })
            return response.data
        },
        onSuccess,
        onError
    })