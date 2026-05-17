import React, { useEffect } from 'react'
import Post from '../component/Post'
import { usePost } from '../hooks/usePost'
import Nav from '../component/Nav'
import '../style/feed.scss'

const Feed = () => {
    const { feed, loading, getDetsHandler, likeHandler, unLikeHandler } = usePost()

    useEffect(() => {
        getDetsHandler();
    }, []);

    if (!feed || loading) {
        return (
            <main className="feed-loading">
                <div className="loader">
                    <div className="loader-ring"></div>
                    <span>Loading feed...</span>
                </div>
            </main>
        )
    }

    return (
        <main className='feed-page'>
            <Nav />
            <div className='feed'>
                <div className="posts">
                    {feed.length === 0 ? (
                        <div className="empty-feed">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM19 5H5V19H19V5ZM15.5 7C16.8807 7 18 8.11929 18 9.5C18 10.8807 16.8807 12 15.5 12C14.1193 12 13 10.8807 13 9.5C13 8.11929 14.1193 7 15.5 7ZM9 7L13.5 14H4.5L7 10.5L9 13L11 10.5L9 7Z"></path></svg>
                            <p>No posts yet. Be the first!</p>
                        </div>
                    ) : (
                        feed.map(post => (
                            <Post
                                key={post._id}
                                user={post.user}
                                post={post}
                                liked={likeHandler}
                                unliked={unLikeHandler}
                            />
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}

export default Feed
