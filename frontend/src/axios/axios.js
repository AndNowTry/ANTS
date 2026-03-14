import axios from "axios"
import { authStore } from "@/stores/auth.js"


const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})


api.interceptors.response.use(
    response => response,
    async error => {
        const auth = authStore()

        const originalRequest = error.config

        if (error.response?.status !== 401)
        {
            return Promise.reject(error)
        }

        if (originalRequest.url.includes("/auth/refresh/") || originalRequest.url.includes("/auth/logout/"))
        {
            auth.DeleteUserInfo()

            return Promise.reject(error)
        }

        try
        {
            const refreshResponse = await api.post("/auth/refresh/")

            if (refreshResponse.data.status === "success")
            {
                return api(originalRequest)
            }

        }
        catch (error)
        {
            await api.post("/auth/logout/")

            auth.DeleteUserInfo()

            return Promise.reject(error)
        }
    }
)

export default api