import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export async function getSongs({ mood }) {
    const response = await api.get("/api/song?mood=" + mood)
    return response.data
}
