const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    resetPasswordToken : { 
        type:String,
        default: null
    },
    resetPasswordExpires : {
        type:Date,
        default: null
    }
})


const User = mongoose.model("User", userSchema)
module.exports = User