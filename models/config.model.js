
const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const configSchema = Schema({
    currency: {
        type:String,
        default:'UGX',
    },
    globalStockAlert: {
        type: Boolean,
        default:true,
    },
    globalStockAlertLimit: {
        type:Number,
        required:true
    },
    debugMode: {
        type:Boolean,
        default:false
    },
    emailText: {
        type: String,
        required:true
    },
    invoiceMessage: {
        type:String,
        required:true
    },
   
})

const Config = mongoose.model('Config', configSchema)

module.exports = Config
