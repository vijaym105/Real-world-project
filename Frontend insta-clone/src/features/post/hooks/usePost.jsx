import { getFeed, createPost, likePost, unLikePost } from "../services/post.api";
import { useContext, useEffect } from "react";
import { PostContext } from '../Post.context';

export const usePost = () => {

    const context = useContext(PostContext);

    const { loading, setloading, feed, setfeed, post, setpost } = context;

    const getDetsHandler = async () => {
        try {
            setloading(true);
            const data = await getFeed();
            console.log(data)
            setfeed(data.note);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    };

    const createPostHandler = async (imgFile, caption) => {
        setloading(true)
        const data = await createPost(imgFile, caption)
        setfeed(data.post, ...feed)
        setloading(false)
    }

    const likeHandler = async (postId) => {

    setfeed(prev =>
        prev.map(post =>
            post._id === postId
                ? { ...post, isLiked: true }
                : post
        )
    )

    try {

        await likePost(postId)

    } catch (error) {

        console.log(error)

        // rollback if API fails
        setfeed(prev =>
            prev.map(post =>
                post._id === postId
                    ? { ...post, isLiked: false }
                    : post
            )
        )
    }
}

    const unLikeHandler = async (postId) => {

    setfeed(prev =>
        prev.map(post =>
            post._id === postId
                ? { ...post, isLiked: false }
                : post
        )
    )

    try {

        await unLikePost(postId)

    } catch (error) {

        console.log(error)

        // rollback
        setfeed(prev =>
            prev.map(post =>
                post._id === postId
                    ? { ...post, isLiked: true }
                    : post
            )
        )
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
    };
};