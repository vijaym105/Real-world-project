const jwt = require('jsonwebtoken')
const BlacklistModel = require('../models/blackList');
const redis = require('../config/cache')
async function authMiddleware(req, res, next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Unathorized access"
        })
    }

    const isTokenBlacklisted = await redis.get(token)
    
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Invalid token",
            success: false
        })
    }
    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(err){
        return res.status(403).json({
            message: "token not found"
        })
    }
    req.user = decoded;
    next()
}

module.exports ={ authMiddleware}