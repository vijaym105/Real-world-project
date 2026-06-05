import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [ songs, setSongs ] = useState([])
    const [ song, setSong ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    return (
        <SongContext.Provider
            value={{ loading, setLoading, song, setSong, songs, setSongs }}
        >
            {children}
        </SongContext.Provider>
    )

}
