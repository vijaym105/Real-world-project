import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { handleRegister } = useAuth()
    const navigate = useNavigate()

    async function handleData(e) {
        e.preventDefault()
        setError("")
        try {
            await handleRegister(username, email, password)
            navigate('/')
        } catch (err) {
            setError("Something went wrong. Please try again.")
        }
    }

    return (
        <main>
            <div className="form-cont">
                <h1>Register</h1>
                {error && <p style={{ color: '#e8453c', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleData}>
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder='Enter your username'
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder='Enter your email'
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
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register