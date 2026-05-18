import { useState } from 'react'
import '../style/form.scss'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    async function HandleData(e) {
        e.preventDefault()
        setError("")
        try {
            await handleLogin(username, password)
            navigate('/')
        } catch (err) {
            setError("Invalid credentials. Please try again.")
        }
    }

    return (
        <main>
            <div className="form-cont">
                <h1>Login</h1>
                {error && <p style={{ color: '#e8453c', fontSize: '0.85rem' }}>{error}</p>}
                <form onSubmit={HandleData}>
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        name='username'
                        placeholder='Enter your username or email'
                    />
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        name='password'
                        placeholder='Enter your password'
                    />
                    <button type='submit'>Submit</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login