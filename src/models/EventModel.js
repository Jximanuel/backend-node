const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    imageUrl: {
     type: String,
     required: true
    },

    time:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    createdAt :{
        type: Date,
        default: Date.now,
        require:true
    },
    location :{
        type: String,
        required: true
    },
    
        publicId:{
            type: String,
            required: true
        }
    
})

const eventModel =  mongoose.model('Event', eventSchema)
module.exports = eventModel;