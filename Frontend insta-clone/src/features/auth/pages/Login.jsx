import React, { useState } from 'react'
import '../style/form.scss'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const [username, setuserName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const {loading, user, handleLogin} = useAuth()


    async function HandleData(dets) {
        dets.preventDefault()

        await handleLogin(username, password)
        navigate('/')
    }
    if(loading){
        return (<main>
            <h1>Loading...</h1>
        </main>)
    }
  return (
    <main>
        <div className="form-cont">
            <h1>Login</h1>
            <form onSubmit={HandleData}>
                <input type="text"
                onInput={(e)=>{setuserName(e.target.value)}}
                name='username' placeholder='Enter your email'/>

                <input type="password"
                onInput={(e)=>{setPassword(e.target.value)}}
                name='password' placeholder='Enter your password'/>
                <button type='submit'>Submit</button>
            </form>
            <p>Don't have an account? <Link to="/register">register</Link></p>
        </div>
    </main>
  )
}

export default Login