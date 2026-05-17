import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth"  && import.meta.env.VITE_API_URL + "/api/auth",
    withCredentials: true
})

export async function registerUser(username, email, password){
    try{
    const res = api.post('/register',{
        username,
        email,
        password
    })
    res.data    
}
    catch(err){
        throw err
    }
}

export async function loginUser(email, password){
    try{
    const res = api.post('/login',{
        email,
        password
    })
    res.data
    }
    catch(err){
        throw err
    }
}


export async function getMe(){
    const res = await api.get('/getMe')

    return res.data
}