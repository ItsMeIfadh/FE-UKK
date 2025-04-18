import { useQuery } from "@tanstack/react-query"
import axiosInstance, { endpoints } from "src/utils/axios"

export const useFetchByIdUser = (id) => {
    return useQuery({
        queryKey: ["fetch.user.by.id", id],
        queryFn: async () => {
            const response = await axiosInstance.get(`${endpoints.user.getById}/${id}`)
            console.log(response.data.data)
            return response.data.data
        },
        enabled: !!id,
    })
}