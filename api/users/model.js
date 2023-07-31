const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    }
    ,
    password: {
        type: String,
        required: true
    }
    ,
    email: {
        type: String,
        required: true,
        unique: true
    }
    ,
    role: {
        type: String,
        required: true,
        default: "user"
    }
    ,
    joining: {
        type: Date,
        default: Date.now
    }
    ,
    profilePic: {
        type: String, 
        default: "https://media.istockphoto.com/id/1210939712/vector/user-icon-people-icon-isolated-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=vKDH9j7PPMN-AiUX8vsKlmOonwx7wjqdKiLge7PX1ZQ=" 
    }
})



const user = model('user', userSchema)
module.exports = user