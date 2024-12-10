const { required } = require('joi')
const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:true,
    },
    items: {
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
    },
    color: {
        type:String,
        default:'black'
    },
    notes: {
        type:String,
        default:'This is a category'
    },
    stockAlert: {
        type:Boolean,
        default:true,
    },
    stockAlertLimit: {
        type:Number,
        default:10
    }
},{timestamps: true})

const Category = mongoose.model('Category',categorySchema)

module.exports = Category