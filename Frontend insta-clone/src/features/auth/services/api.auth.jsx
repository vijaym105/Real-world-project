import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth"  && import.meta.env.VITE_API_URL + "/api/auth",
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


export async function getMe(){
    const res = await api.get('/getMe')

    return res.data
}