import { useState } from 'react'
import '../style/form.scss'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const [identifier, setIdentifier] = useState("") 
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    async function HandleData(e) {
        e.preventDefault()
        setError("")
        try {
            await handleLogin(identifier, password)
            navigate('/')
        } catch (err) {
            setError("Invalid credentials. Please try again.")
        }
    }

    return (
        <main>
            <div className="form-cont">
                <h1>Login</h1>
                {error && <p style={{ color: '#e8453c', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={HandleData}>
                    <input
                        type="text"
                        onChange={(e) => setIdentifier(e.target.value)}
                        value={identifier}
                        placeholder='Enter your username or email'
                        required
                    />
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder='Enter your password'
                        required
                    />
                    <button type='submit'>Submit</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login