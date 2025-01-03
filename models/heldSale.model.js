const mongoose = require('mongoose')

const saleHoldSchema = mongoose.Schema({
    identifier:{
        type: String,
        required: true
    },
    products :{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Product',
        required: true
    },
    collections:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Collection',
    },
    executor : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    reason : {
        type:String,
        default:'No reason specified'
    }
},{timestamps:true})

const HeldSale = mongoose.model('heldTransaction',saleHoldSchema)

module.exports = HeldSale

