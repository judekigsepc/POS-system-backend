const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
    },
    businessType:{
        type:String,
    },
    contactInfo: {
        phone:[{
             type:String,
             required:true,
             unique:true,
        }],
        email: {
            type: String,
            required: true,
            match: /^\S+@\S+\.\S+$/, // Basic email validation
        },
        website: {
            type: String,
            trim: true, // Removes extra spaces
        },
    },

    address: {
        country:String,
        city:String,
        region:String,
    },
    imgURL: {
        type:String,
        default:'',
    },
    currency: {
        type:String,
        required:true,
        default:'UGX'
    },
    VATNumber: {
        type:String,
        required:true,
    },
},{timestamps:true});

const Business = mongoose.model('Business', businessSchema)

module.exports = Business;
