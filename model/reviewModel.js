const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
    review: {
        type:String,
        required:[true,'review can not be empty']
    },
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to tour.']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to user.']
    }
})
// reviewSchema.pre(/^find/,function(next){
//     this.populate({
//         path:'tour',
//         select:'name'
//     }).populate({
//         path:'user',
//         select:'name'
//     })
//     next()
// })


module.exports = mongoose.model('Reviews',reviewSchema);