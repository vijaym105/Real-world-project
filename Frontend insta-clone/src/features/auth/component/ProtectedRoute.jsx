import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <main style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#0a0a0a',color:'#666',fontFamily:'sans-serif'}}>
            <p>Loading...</p>
        </main>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute