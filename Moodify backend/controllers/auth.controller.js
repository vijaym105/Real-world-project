const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const blackModel = require('../models/blackList')
const redis = require('../config/cache')

async function registerUser(req, res){
    const {username, email , password} = req.body
    const isExist = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isExist){
       return res.status(400).json({
            messgae: "User or email has been alread taken."
        })
    }
    
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })
    
    const token = jwt.sign({
        id: user._id,
        username: user.username
    },process.env.JWT_SECRET , {
        expiresIn: "3d"
    })

    res.cookie("token", token)

    return res.status(200).json({
        message:"User registered successfuly",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginUser(req, res){
    const {email , username , password} = req.body
    const user = await userModel.findOne({
        $or:[
            { username },
            { email }
        ]
    }).select('+password')
    if(!user){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }
    
    const isVaildPass = await bcrypt.compare(password, user.password)
    if(!isVaildPass){
        return res.status(400).json({
            message:"Inavalid credential"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET , {
        expiresIn: "3d"
    })
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfuly",
        user:{
            id: user._id,
            username: user.username,
            email:user.email
        }
    })

}

async function getMe(req, res){
    const userID = req.user.id
    const user = await userModel.findById(userID)
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message: "Dets fetched successfuly",
        user
    })
}

async function logOut(req, res){
    const token = req.cookies.token;

    res.clearCookie("token");
   
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);

    res.status(200).json({
        message:"logout successfuly"
    })
}


module.exports = { registerUser, loginUser , getMe, logOut}