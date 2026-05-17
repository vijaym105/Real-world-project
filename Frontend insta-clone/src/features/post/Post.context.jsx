import { createContext, useState } from "react";

export const PostContext = createContext()

export const PostContProvider = ({ children }) => {
    const [loading, setloading] = useState(false)
    const [feed, setfeed] = useState([])
    const [post, setpost] = useState(null)



    return (
        <PostContext.Provider value={{
            loading,
            setloading,
            feed,
            setfeed,
            post,
            setpost
        }}>
            {children}
        </PostContext.Provider>
    )
}