const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const blackModel = require('../models/blackList')
const redis = require('../config/cache')

const isProd = process.env.NODE_ENV === 'production'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,               // HTTPS only in production
    sameSite: isProd ? 'none' : 'lax', // cross-origin cookies in production
    maxAge: 3 * 24 * 60 * 60 * 1000   // 3 days in ms
}

async function registerUser(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "username, email and password are required." })
    }

    const isExist = await userModel.findOne({ $or: [{ username }, { email }] })
    if (isExist) {
        return res.status(400).json({ message: "Username or email has already been taken." })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({ username, email, password: hash })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    )

    res.cookie('token', token, COOKIE_OPTIONS)

    return res.status(200).json({
        message: "User registered successfully",
        user: { id: user._id, username: user.username, email: user.email }
    })
}

async function loginUser(req, res) {
    const { email, username, password } = req.body

    if (!password || (!email && !username)) {
        return res.status(400).json({ message: "Credentials are required." })
    }

    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    }).select('+password')

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const isValidPass = await bcrypt.compare(password, user.password)
    if (!isValidPass) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    )

    res.cookie('token', token, COOKIE_OPTIONS)

    return res.status(200).json({
        message: "User logged in successfully",
        user: { id: user._id, username: user.username, email: user.email }
    })
}

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "Details fetched successfully", user })
}

async function logOut(req, res) {
    const token = req.cookies.token

    res.clearCookie('token', COOKIE_OPTIONS)

    if (token) {
        await redis.set(token, Date.now().toString(), 'EX', 60 * 60)
    }

    res.status(200).json({ message: "Logged out successfully" })
}

module.exports = { registerUser, loginUser, getMe, logOut }
