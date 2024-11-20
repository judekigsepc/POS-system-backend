const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    names:{
        type:String,
        unique:true,
        required:true,
    },
    sex:{
        type:String,
        enum:['MALE','FEMALE'],
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    admin: {
         type:Boolean,
         required:true,
    },
    email: {
        type:String,
        unique:true,
    },
    tels: [{
        type:String,
        require:true,
    }],
    role:{
        type:String,
        required:true,
    },
    imgUrl: {
        type:String,
        required:false,
        default:""
    }
})

userSchema.pre('validate', function (next) {
    if(this.names) {
        this.names = this.names.toUpperCase()
    } 
    next()
}) 

const User = mongoose.model('User',userSchema)

module.exports = User