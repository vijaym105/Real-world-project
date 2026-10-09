import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
})

export async function register({ username, email, password }){
    const resp = await api.post("/auth/register", {username, email, password});
    return resp.data
}

export async function login({ email, password }) {
    const resp = await api.post("/auth/login", {
        email,
        password
    });

    return resp.data;
}

export async function getMe(){
    const resp = await api.get("/auth/getMe");
    return resp.data;
}