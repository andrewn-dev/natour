const Review  = require('../model/reviewModel');


exports.getAllReviews = async (req,resp,next)=>{
    try {
        const review = await Review.find().populate({
            path:'tour',
            select:'name summary'
        }).populate({
            path:'user',
            select:'name email'
        });
        resp.status(200).json({
            status:'success',
            data:{
                review
            }
        })
        
    } catch (error) {
        resp.status(400).json({status:'fail',msg:error.message})
    }
}

exports.createReview = async (req,resp,next)=>{
    try {
        const review = await   Review.create(req.body)
        resp.status(200).json({
            status:'success',
            data:{
                review
            }
        })
    } catch (error) {
        resp.status(400).json({status:'fail',msg:error.message})
    }
}