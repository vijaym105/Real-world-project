import { createBrowserRouter, Navigate } from 'react-router';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import Protected from '../features/auth/components/Proctected.jsx';
import Dashboard from '../features/chat/pages/Dashboard.jsx';

export const route = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: <Protected>
            <Dashboard />
        </Protected>
    },
    {
        path: '/dashboard',
        element: <Navigate to='/' replace />
    }
])