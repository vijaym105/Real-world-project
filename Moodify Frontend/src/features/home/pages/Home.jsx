import React, { useState } from 'react'
import FaceExpression from '../../expression/Component/FaceExpression'
import Player from '../component/Player'
import { useSong } from '../hooks/useSong'
import { useAuth } from '../../auth/hooks/useAuth'
import './home.scss'

const MOOD_META = {
    happy:    { emoji: '😄', label: 'Happy(Vibin)',    color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
    sad:      { emoji: '😢', label: 'Low(Calm)',      color: '#5b9bd5', bg: 'rgba(91,155,213,0.12)' },
    confused: { emoji: '😕', label: 'Confused(Fired Up)', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    neutral:  {emoji: '🙂', label: 'Neutral', color: '#f6ddb5da', bg: 'rgba(167,139,250,0.12)' }
}

const Home = () => {
    const { handleGetSongs, loading, songs, song, setSong } = useSong()
    const { user, handleLogout } = useAuth()
    const [detectedMood, setDetectedMood] = useState(null)
    const [showCamera, setShowCamera] = useState(false)

    async function onExpressionDetected(expression) {
        setDetectedMood(expression)
        setShowCamera(false)
        await handleGetSongs({ mood: expression })
    }

    const moodMeta = detectedMood ? MOOD_META[detectedMood] : null

    return (
        <div className="home">
            {/* ── Sidebar ── */}
            <aside className="home__sidebar">
                <div className="home__sidebar-header">
                    <div className="home__logo">
                        <span className="home__logo-icon">🎵</span>
                        <span className="home__logo-text">Moodify</span>
                    </div>
                    <button className="home__logout-btn" onClick={handleLogout} title="Logout">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                    </button>
                </div>

                {user && (
                    <div className="home__user">
                        <div className="home__user-avatar">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="home__user-info">
                            <p className="home__user-name">{user.username}</p>
                            <p className="home__user-email">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="home__sidebar-section">
                    {moodMeta && (
                        <div className="home__mood-badge" style={{ '--mood-color': moodMeta.color, '--mood-bg': moodMeta.bg }}>
                            <span className="home__mood-emoji">{moodMeta.emoji}</span>
                            <div>
                                <p className="home__mood-label">Current Mood</p>
                                <p className="home__mood-name">{moodMeta.label}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="home__queue">
                    <p className="home__queue-title">
                        {songs.length > 0
                            ? `${songs.length} song${songs.length !== 1 ? 's' : ''} found`
                            : 'No songs yet'}
                    </p>

                    {loading && (
                        <div className="home__loading">
                            <div className="home__spinner" />
                            <span>Finding songs…</span>
                        </div>
                    )}

                    <div className="home__song-list">
                        {songs.map((s, i) => (
                            <button
                                key={s._id || i}
                                className={`home__song-item ${song?._id === s._id ? 'active' : ''}`}
                                onClick={() => setSong(s)}
                            >
                                <div className="home__song-item-num">
                                    {song?._id === s._id ? (
                                        <span className="home__now-playing-icon">
                                            <span/><span/><span/>
                                        </span>
                                    ) : (
                                        <span>{i + 1}</span>
                                    )}
                                </div>
                                <img
                                    className="home__song-thumb"
                                    src={s.ThumbnailUrl}
                                    alt={s.title}
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                                <div className="home__song-meta">
                                    <p className="home__song-title">{s.title}</p>
                                    <p className="home__song-mood">{s.mood}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="home__main">
                <div className="home__hero">
                    <div className="home__hero-bg" />

                    <div className="home__hero-content">
                        {!showCamera ? (
                            <div className="home__welcome">
                                <h1 className="home__headline">
                                    Music that <br />
                                    <em>feels</em> like you.
                                </h1>
                                <p className="home__subline">
                                    Let your face pick the vibe. We'll find the songs.
                                </p>

                                {moodMeta && songs.length > 0 ? (
                                    <div className="home__result">
                                        <p className="home__result-text">
                                            Feeling <strong style={{ color: moodMeta.color }}>{moodMeta.label}</strong>?
                                            Found <strong>{songs.length} tracks</strong> for you.
                                        </p>
                                        <div className="home__cta-row">
                                            <button
                                                className="home__detect-btn"
                                                onClick={() => setShowCamera(true)}
                                            >
                                                Detect Again
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="home__detect-btn home__detect-btn--primary"
                                        onClick={() => setShowCamera(true)}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                            <circle cx="12" cy="12" r="3"/>
                                            <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/>
                                        </svg>
                                        Detect My Mood
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="home__camera-wrap">
                                <div className="home__camera-header">
                                    <h2>Looking at your face…</h2>
                                    <button
                                        className="home__close-btn"
                                        onClick={() => setShowCamera(false)}
                                    >✕</button>
                                </div>
                                <FaceExpression onClick={onExpressionDetected} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Player />
        </div>
    )
}

export default Home
