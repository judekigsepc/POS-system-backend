const { required } = require('joi')
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
    stockAlert: {
        type:Boolean,
        default:true,
    },
    stockAlertLimit: {
         type:Number,
         default:10,
    },
    units: {
        type:String,
        default:'item',
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
        default: 0,
    },
    discountType: {
        type:String,
        enum:['flat','percent'],
        default:'percent'
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