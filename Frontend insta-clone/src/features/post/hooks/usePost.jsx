import { getFeed, createPost, likePost, unLikePost } from "../services/post.api";
import { useContext, useEffect } from "react";
import { PostContext } from '../Post.context';

export const usePost = () => {
    const context = useContext(PostContext)
    const { loading, setloading, actionLoading, setActionLoading, feed, setfeed, post, setpost } = context

    const getDetsHandler = async () => {
        try {
            setloading(true)
            const data = await getFeed()
            setfeed(data.note)
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
            await getDetsHandler()
        } catch (err) {
            console.log(err)
        } finally {
            setloading(false)
        }
    }

    const likeHandler = async (postId) => {
        // optimistic update - flip isLiked instantly, no loading screen
        setfeed(prev => prev.map(p =>
            p._id === postId ? { ...p, isLiked: true } : p
        ))
        try {
            await likePost(postId)
        } catch (err) {
            // revert on failure
            setfeed(prev => prev.map(p =>
                p._id === postId ? { ...p, isLiked: false } : p
            ))
            console.log(err)
        }
    }

    const unLikeHandler = async (postId) => {
        setfeed(prev => prev.map(p =>
            p._id === postId ? { ...p, isLiked: false } : p
        ))
        try {
            await unLikePost(postId)
        } catch (err) {
            setfeed(prev => prev.map(p =>
                p._id === postId ? { ...p, isLiked: true } : p
            ))
            console.log(err)
        }
    }

    useEffect(() => {
        getDetsHandler()
    }, [])

    return {
        loading,
        actionLoading,
        feed,
        post,
        setpost,
        getDetsHandler,
        createPostHandler,
        likeHandler,
        unLikeHandler
    }
}