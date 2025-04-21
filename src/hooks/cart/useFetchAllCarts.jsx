import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchAllCarts = () => {
    return useQuery({
        queryKey: ['carts'],
        queryFn: async () => {
            const response = await axiosInstance.get(endpoints.cart.all);
            console.log(response)
            return response.data;
        },
    });
}