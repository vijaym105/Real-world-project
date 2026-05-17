import { getFeed, createPost, likePost, unLikePost } from "../services/post.api";
import { useContext, useEffect } from "react";
import { PostContext } from '../Post.context';

export const usePost = () => {
    const context = useContext(PostContext)
    const { loading, setloading, feed, setfeed, post, setpost } = context

    const getDetsHandler = async () => {
        try {
            setloading(true)
            const data = await getFeed()
            setfeed(data.note)  // data.note is the array from backend
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }

    const createPostHandler = async (imgFile, caption) => {
        try {
            setloading(true)
            await createPost(imgFile, caption)
            await getDetsHandler()  // re-fetch full feed after creating
        } catch (err) {
            console.log(err)
        } finally {
            setloading(false)
        }
    }

    const likeHandler = async (postId) => {
        try {
            await likePost(postId)
            await getDetsHandler()
        } catch (err) {
            console.log(err)
        }
    }

    const unLikeHandler = async (postId) => {
        try {
            await unLikePost(postId)
            await getDetsHandler()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDetsHandler()
    }, [])

    return {
        loading,
        feed,
        post,
        setpost,
        getDetsHandler,
        createPostHandler,
        likeHandler,
        unLikeHandler
    }
}