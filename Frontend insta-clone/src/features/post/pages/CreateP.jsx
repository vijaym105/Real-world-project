import React, { useState, useRef } from 'react'
import { usePost } from '../hooks/usePost'
import { useNavigate } from 'react-router'
import '../style/create.scss'

const CreateP = () => {
    const [caption, setCaption] = useState("")
    const [preview, setPreview] = useState(null)
    const ImginpRef = useRef(null)
    const navigate = useNavigate()
    const { loading, createPostHandler } = usePost()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
        }
    }

    async function onSubmitHandler(e) {
        e.preventDefault()
        const file = ImginpRef.current.files[0]
        if (!file) return
        await createPostHandler(file, caption)
        navigate("/")
    }

    if (loading) {
        return (
            <main className="create-page">
                <div className="create-loading">
                    <div className="loader-ring"></div>
                    <span>Uploading your post...</span>
                </div>
            </main>
        )
    }

    return (
        <main className='create-page'>
            <div className="create-container">
                <div className="create-header">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.828 11H20V13H7.828L13.192 18.364L11.778 19.778L4 12L11.778 4.222L13.192 5.636L7.828 11Z"/>
                        </svg>
                    </button>
                    <h1>New Post</h1>
                    <div style={{width: 36}}/>
                </div>

                <form onSubmit={onSubmitHandler} className="create-form">
                    <label className='file-drop-zone' htmlFor="file-upload">
                        {preview ? (
                            <img src={preview} alt="preview" className="file-preview" />
                        ) : (
                            <div className="file-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"/>
                                </svg>
                                <span>Tap to select photo</span>
                                <small>JPG, PNG, WebP</small>
                            </div>
                        )}
                    </label>
                    <input
                        ref={ImginpRef}
                        hidden
                        type="file"
                        accept="image/*"
                        name='file'
                        id='file-upload'
                        onChange={handleFileChange}
                    />

                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption…"
                        className="caption-input"
                        rows={3}
                    />

                    <button type='submit' className='submit-btn' disabled={!preview}>
                        Share Post
                    </button>
                </form>
            </div>
        </main>
    )
}

export default CreateP
