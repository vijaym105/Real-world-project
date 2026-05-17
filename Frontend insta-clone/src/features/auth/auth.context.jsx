import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe , logoutUser } from "./services/api.auth.jsx";

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) 

    
    useEffect(() => {
        getMe()
            .then(data => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const handleLogin = async (email, password) => {
        const response = await loginUser(email, password)
        const me = await getMe()
        setUser(me.user)
    }

    const handleRegister = async (username, email, password) => {
        const response = await registerUser(username, email, password)
        const me = await getMe()
        setUser(me.user)
    }

    const handleLogout = async () => {
    try {
        await logoutUser()
    } catch (err) {
        console.log(err)
    } finally {
        setUser(null)  // clear user regardless
    }
}

    return (
        <AuthContext.Provider value={{ user, loading, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}