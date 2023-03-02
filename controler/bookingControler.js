const stripe = require('stripe')('sk_test_51MeyudSEL2v8l27fsNfzlUzZVX1mKYU6VKGYDOgvRGwjrWgTFKCxxHEjKq4ZaQBDqkbxycGvg9115hmmK2f9Yzs2008RR2u4WM');
const  Tour  = require('../model/tourModel');
// const User = require('../model/userModel')
const Booking = require('../model/bookingModel');

exports.getCheckoutSession = async (req,resp)=>{

    try {
        // 1) get the currently booked tour 
        const tour  = await Tour.findById(req.params.tourId)
        console.log(tour);
        // 2) create checkout session 
    
        const session = await stripe.checkout.sessions.create({
            line_items: [{
              price_data: {
                currency: 'usd',
                unit_amount:tour.price,
                product_data: {
                  name: tour.name,
                  description: tour.summary,
                },
              },
              quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost4500`,
            cancel_url: `http://localhost4500`,
          });
        // 3) create session as response 
        resp.status(200).json({
            status:'success',
            session
        })
        
    } catch (error) {
        resp.status(400).json({status:'fail',err:error.message}) 
    }
}

exports.getTourBooking = async(req,resp)=>{
    try {
        const booking  = await Booking.find()
        resp.status(200).json({
            status:'success',
            booking:booking
        })
        

    } catch (error) {
        resp.status(400).json({status:'fail',err:error.message}) 
    }
}

exports.getTourBooking = async(req,resp,next)=>{
    try {
        const booking  = await Booking.find()
        resp.status(200).json({
            status:'success',
            booking:booking
        })
        next()

    } catch (error) {
        resp.status(400).json({status:'fail',err:error.message}) 
    }
}

exports.createTourBooking = async(req,resp,next)=>{
    try {
        const booking  = await Booking.create(req.body)
        resp.status(200).json({
            status:'success',
            booking:booking
        })
        next();
    } catch (error) {
        resp.status(400).json({status:'fail',err:error.message}) 
    }
}


