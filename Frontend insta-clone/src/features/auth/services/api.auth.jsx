import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL + "/api/auth"
        : "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function registerUser(username, email, password) {
    const res = await api.post('/register', { username, email, password })
    return res.data
}

export async function loginUser(email, password) {
    const res = await api.post('/login', { email, password })
    return res.data
}

export async function getMe() {
    const res = await api.get('/getMe')
    return res.data
}

export async function logoutUser() {
    const res = await api.post('/logout')
    return res.data
}