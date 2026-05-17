import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "./services/api.auth.jsx";

export const AuthContext = createContext()

export  function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email, password) => {
        setLoading(true)
        try{
        const response = await loginUser(email , password)
        setUser(response)

    }
    catch(err){
        console.log(err)
    }
    finally{
        setLoading(false)
    }
}

    const handleRegister = async(username, email, password) =>{
        setLoading(true)
        try{
        const response = await registerUser(username, email, password)
        setUser(response)
    
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
    }


return (
    <AuthContext.Provider value={{user, loading, handleLogin, handleRegister}}>
        {children}
    </AuthContext.Provider>
)
}

