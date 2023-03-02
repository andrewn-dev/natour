const mongoose = require('mongoose');

const bookingModel = new mongoose.Schema({
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Booking must belong to Tour']
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Booking must belong to User']
    },
    price:{
        type:Number,
        required:[true,'booking must have price']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})
module.exports = mongoose.model('Booking',bookingModel);