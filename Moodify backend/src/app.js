const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRoutes = require('../routes/auth.route')
const route = require('../routes/song.route')
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


/**
 * @routes /api/auth/register
 */
app.use('/api/auth', authRoutes)

/**
 * @route /api/song/
 */
app.use('/api/song', route)


module.exports = app