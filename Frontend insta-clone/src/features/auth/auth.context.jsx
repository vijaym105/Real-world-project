import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe, logoutUser } from "./services/api.auth.jsx";

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

    const handleLogin = async (identifier, password) => {
        try {
            await loginUser(identifier, password)
            const me = await getMe()
            setUser(me?.user || null)
        } catch (err) {
            throw err
        }
    }

    const handleRegister = async (username, email, password) => {
        try {
            await registerUser(username, email, password)
            const me = await getMe()
            setUser(me?.user || null)
        } catch (err) {
            throw err
        }
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