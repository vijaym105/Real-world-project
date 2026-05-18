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

    if (loading && feed.length === 0) {
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
