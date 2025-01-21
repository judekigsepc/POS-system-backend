const mongoose = require('mongoose')

const collectionSchema = mongoose.Schema({
    name: {
        type:String,
        unique:true,
        required:true,
    },
    collectionCode: {
        type:String,
        required:true
    },
    items: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Product'
    },
    color: {
        type:String,
        default:'black'
    },
    description: {
        type:String,
        default:'This is a category'
    },
    inStock: {
        type:Number,
    },
    stockAlert: {
        type:Boolean,
        default:true,
    },
    stockAlertLimit: {
        type:Number,
        default:10
    },
    saleable: {
        type:Boolean,
        default:false
    }
},{timestamps: true})

const Collection = mongoose.model('Collection',collectionSchema)

module.exports = Collection