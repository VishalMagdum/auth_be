const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: (value) => validator.isEmail(value)
    },
    mobile: {
        type: String,
        required: true,
        // max: ['10', 'Can not be greater than 10 Number'],
        validate: (value) => { return validator.isNumeric(value) && value.length === 10 }
    },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    createdAt: { type: Date, default: Date.now() }
},

    {
        collection: 'user_auth',
        versionKey: false
    })

const userModel = mongoose.model('user_auth', userSchema)
module.exports = { userModel }