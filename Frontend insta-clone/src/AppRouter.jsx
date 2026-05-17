// src/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/post/pages/Feed'
import CreateP from './features/post/pages/CreateP'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import GuestRoute from './features/auth/components/GuestRoute'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <ProtectedRoute><Feed /></ProtectedRoute>
                } />
                <Route path='/create-post' element={
                    <ProtectedRoute><CreateP /></ProtectedRoute>
                } />
                <Route path='/login' element={
                    <GuestRoute><Login /></GuestRoute>
                } />
                <Route path='/register' element={
                    <GuestRoute><Register /></GuestRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter