const mongoose = require('mongoose')

const blackListSchema = mongoose.Schema({
    token:{
        type: String,
        required: [true, "Token is required."]
    }
}, {
    timestamps: true
})

const blackListModel = mongoose.model("BlackList", blackListSchema)

module.exports = blackListModel;