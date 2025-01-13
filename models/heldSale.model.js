const mongoose = require('mongoose')

const saleHoldSchema = mongoose.Schema({
    identifier:{
        type: String,
        required: true
    },
    products:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Product',
        required: true
    },
    collections: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Collection',
        required: true
    },
    executor : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    reason : {
        type:String,
        default:'No reason specified'
    },
    status: {
        type:String,
        enum: ['held','resumed'],
    }
},{timestamps:true})

const HeldSale = mongoose.model('heldSale',saleHoldSchema)

module.exports = HeldSale

