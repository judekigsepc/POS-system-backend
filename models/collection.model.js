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
    stockAlert: {
        type:Boolean,
        default:true,
    },
    stockAlertLimit: {
        type:Number,
        default:10
    },
    priceValue: {
        type:Number,
        default:0
    },
    discount: {
        type:Number,
        default:0,
    },
    discountType: {
        type:String,
        enum:['percent','flat'],
        default:'percent'
    },
    saleable: {
        type:Boolean,
        default:false
    }
},{timestamps: true})

const Collection = mongoose.model('Category',collectionSchema)

module.exports = Collection