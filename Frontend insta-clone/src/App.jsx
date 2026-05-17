import React from 'react'
import { RouterProvider } from 'react-router'
import AppRouter from './AppRouter'
import { AuthProvider } from './features/auth/auth.context'
import './style.scss'
import { PostContProvider } from './features/post/Post.context'


const App = () => {
  return (
    <AuthProvider>
      <PostContProvider>
        <AppRouter />
      </PostContProvider>
    </AuthProvider>

  )
}

export default App  