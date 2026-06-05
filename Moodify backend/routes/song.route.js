const express = require("express")
const upload = require('../middleware/upload.middleware')
const songController = require("../controllers/song.controller")


const route = express.Router()


route.post('/', upload.single("song"), songController.songCreat)

route.get('/', songController.getSong)

module.exports  = route