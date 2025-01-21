const { required } = require('joi')
const mongoose = require('mongoose')

const { Schema } = mongoose

const bundleSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    products: {
        type:[mongoose.Schema.Types.ObjectId],
        required:true
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
    }
})