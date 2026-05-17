import React, { useState } from 'react'
import { followUser, unfollowUser } from '../services/post.api'

const Post = ({ user, post, liked, unliked }) => {
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)

    const handleFollow = async () => {
        if (followLoading) return
        setFollowLoading(true)
        try {
            if (isFollowing) {
                await unfollowUser(user.username)
                setIsFollowing(false)
            } else {
                await followUser(user.username)
                setIsFollowing(true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setFollowLoading(false)
        }
    }

    return (
        <article className="post">
            <div className="post__header">
                <div className="post__user">
                    <div className="post__avatar-ring">
                        <img src={user?.profilePic} alt={user?.username} className="post__avatar" />
                    </div>
                    <div className="post__user-info">
                        <span className="post__username">{user?.username}</span>
                        <span className="post__time">Just now</span>
                    </div>
                </div>
                <button
                    className={`post__follow-btn ${isFollowing ? 'post__follow-btn--following' : ''}`}
                    onClick={handleFollow}
                    disabled={followLoading}
                >
                    {followLoading ? (
                        <span className="btn-spinner"></span>
                    ) : isFollowing ? (
                        'Following'
                    ) : (
                        'Follow'
                    )}
                </button>
            </div>

            <div className="post__image-wrap">
                <img src={post.imgFile} alt="post" className="post__image" />
            </div>

            <div className="post__actions">
                <div className="post__actions-left">
                    <button
                        className={`post__action-btn ${post.isLiked ? 'post__action-btn--liked' : ''}`}
                        onClick={() => post.isLiked ? unliked(post._id) : liked(post._id)}
                        aria-label="Like"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
                        </svg>
                    </button>
                    <button className="post__action-btn" aria-label="Comment">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242Z" />
                        </svg>
                    </button>
                    <button className="post__action-btn" aria-label="Share">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14Z" />
                        </svg>
                    </button>
                </div>
                <button className="post__action-btn" aria-label="Save">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2Z" />
                    </svg>
                </button>
            </div>

            {post.caption && (
                <div className="post__caption">
                    <span className="post__caption-user">{user?.username}</span>
                    <span className="post__caption-text">{post.caption}</span>
                </div>
            )}
        </article>
    )
}

export default Post
