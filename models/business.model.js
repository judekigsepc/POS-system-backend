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
    },
    
},{timestamps:true});

const Busines = mongoose.model('Business', businessSchema);

module.exports = Busines;
