import { login, register, getMe, logout } from "../services/auth.api";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext)
    const fetchedRef = useRef(false)

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        const data = await register({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true)
        const data = await login({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe() {
        try {
            const data = await getMe()
            setUser(data.user)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    useEffect(() => {
        if (fetchedRef.current) return
        fetchedRef.current = true
        handleGetMe()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout, handleGetMe }
}
