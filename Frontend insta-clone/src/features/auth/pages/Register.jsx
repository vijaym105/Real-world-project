import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
const [username, setuserName] = useState("")
const [email, setEmail] = useState(null)
const [password, setPassword] = useState("")
const {handleRegister , loading} = useAuth()
const navigate = useNavigate()

async function handleData(e){
    e.preventDefault()

    await handleRegister(username, email, password)
    console.log("user Registerd successfuly")
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
            <h1>Register</h1>
            <form onSubmit={handleData}>
                <input type="text"
                onInput={(e)=> {setuserName(e.target.value)}}
                name='username' placeholder='Enter your name'/>

                <input type="text" 
                onInput={(e)=> {setEmail(e.target.value)}}
                name='email' placeholder='Enter your email'/>

                <input type="password"
                onInput={(e)=> {setPassword(e.target.value)}}
                name='password' placeholder='Enter your password'/>
                <button type='submit'>Submit</button>

            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </main>
  )
}

export default Register