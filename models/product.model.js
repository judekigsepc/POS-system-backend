const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
    name :{
        type:String,
        required:true,
        unique:true,
    },
    prodCode: {
        type:String,
        required:true,
        unique:true,
    },
    price : {
        type:Number,
        required:true,
    },
    inStock: {
        type:Number,
        required:true,
    },
    units: {
        type:String,
        default:'unit',
    },
    sku: {
        type:String,
        required:true,
        unique:true,
    },
    category: {
        type:String,
        required:true,
    },
    discount: {
        type:Number,
        min:0,
        max:100,
        default:0,
    },
    discountType: {
        type:String,
        required:true,
        enum:['flat','percent']
    },
    taxes: {
        type:Number,
        default:0,
    },
    imgUrl: {
        type:String,
        default:""
    }
},{timestamps:true})

const Product = mongoose.model('Product',productSchema)

module.exports = Product