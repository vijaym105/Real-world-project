const mongoose = require("mongoose")

const SongSchema = new mongoose.Schema({
    
    title:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    ThumbnailUrl:{
        type: String,
        required: true
    },
    mood:{
        type: String,
        enum:{
            values: ['sad', 'happy', 'confused']
        }
    }
})

const songModel = mongoose.model("songs", SongSchema)

module.exports = songModel