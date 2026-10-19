import React from 'react'
import { RouterProvider } from "react-router"
import { router } from "./AppRoutes"
import './features/Shared/styles/global.scss'

import { SongContextProvider } from './features/home/song.context'

const App = () => {
  return (
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>

  )
}

export default App