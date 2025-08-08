const mongoose = require('mongoose')

const scheduleSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    imageUrl:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default:Date.now,
        required:true
    },
    
    publicId:{
        type: String,
            required: true
    }

})

const Schedule = mongoose.model('Schedule', scheduleSchema)
module.exports = Schedule