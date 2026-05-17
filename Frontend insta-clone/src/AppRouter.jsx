import {BrowserRouter, Routes, Route,} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/post/pages/Feed'
import CreateP from './features/post/pages/CreateP'


const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element= {<Feed/>} />
            <Route path='/register'  element={<Register  />} />
            <Route path='/login'  element={<Login />} />
            <Route path='/create-post' element={<CreateP />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter