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
        default:10
    },
    debugMode: {
        type:Boolean,
        default:false
    },
    emailText: {
        type: String,
        emailText: 'Invoice email'
    },
    invoiceMessage: {
        type:String,
        default:'Thank you for shopping with uss'
    },
})

const Config = mongoose.model('Config', configSchema)

module.exports = Config
