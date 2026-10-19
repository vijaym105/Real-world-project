const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const songRoutes = require('../routes/song.route')

const app = express()

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(o => o.trim())
    : ['http://localhost:5173']

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        callback(new Error(`CORS: origin ${origin} not allowed`))
    }
}))

app.use(express.json())


app.use('/api/song', songRoutes)

module.exports = app
