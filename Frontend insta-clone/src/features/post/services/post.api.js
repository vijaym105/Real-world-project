import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000" && import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function getFeed() {
    const resp = await api.get('/api/post/feed')
    return resp.data
}

export async function createPost(imgFile, caption) {
    const formData = new FormData()
    formData.append("image", imgFile)
    formData.append("caption", caption)
    const resp = await api.post("/api/post/", formData)
    return resp.data
}

export async function likePost(postId) {
    const resp = await api.post('/api/post/like/' + postId)
    return resp.data
}

export async function unLikePost(postId) {
    const resp = await api.post('/api/post/Unlike/' + postId)
    return resp.data
}

export async function followUser(username) {
    const resp = await api.post('/api/follow/' + username)
    return resp.data
}

export async function unfollowUser(username) {
    const resp = await api.post('/api/unfollow/' + username)
    return resp.data
}
