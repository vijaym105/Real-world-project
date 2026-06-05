import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {
    const { user, loading } = useAuth()

    // If no user, redirect immediately — don't wait for loading
    if (!user) {
        return <Navigate to='/login' />
    }

    if (loading) {
        return <h1>Loading</h1>
    }

    return children
}

export default Protected