import React from 'react'
import { useNavigate } from 'react-router'

const Nav = () => {
    const navigate = useNavigate()
    return (
        <header className='nav'>
            <div className="nav__brand">
                <svg className="nav__logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="10" fill="url(#grad)"/>
                    <path d="M16 8C11.58 8 8 11.58 8 16C8 20.42 11.58 24 16 24C20.42 24 24 20.42 24 16C24 11.58 20.42 8 16 8ZM16 21C13.24 21 11 18.76 11 16C11 13.24 13.24 11 16 11C18.76 11 21 13.24 21 16C21 18.76 18.76 21 16 21Z" fill="white"/>
                    <circle cx="24.5" cy="8.5" r="1.5" fill="white"/>
                    <defs>
                        <linearGradient id="grad" x1="0" y1="32" x2="32" y2="0">
                            <stop offset="0%" stopColor="#f09433"/>
                            <stop offset="25%" stopColor="#e6683c"/>
                            <stop offset="50%" stopColor="#dc2743"/>
                            <stop offset="75%" stopColor="#cc2366"/>
                            <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span className="nav__title">InstaRam</span>
            </div>
            <div className="nav__actions">
                <button className='nav__create-btn' onClick={() => navigate('/create-post')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"/>
                    </svg>
                    <span>Create</span>
                </button>
            </div>
        </header>
    )
}

export default Nav
