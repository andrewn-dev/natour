const mongoose = require('mongoose')
const express = require ('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')

const tourRouter = require('./router/tourRoutes');
const userRouter = require('./router/userRoute')
const reviewRouter = require('./router/reviewsRoute');
const bookingRoute = require('./router/bookingRoute');
const app = express();

mongoose.connect('mongodb+srv://anunay:PFVvZ8uGhS3YyfOY@cluster0.6cilppr.mongodb.net/natours?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("database connected successfull");
}).catch((err)=>{
    console.log("Error while connecting database",err);
})
const limiter = rateLimit({
    max:10,
    windowMs: 60*60*1000,
    message:'Too many requests from IP, please try again in an hours!'
})
app.use(express.json());
app.use('/api',limiter);
app.use(helmet())


app.use('/api/tours',tourRouter)
app.use('/api/users',userRouter)
app.use('/api/reviews',reviewRouter)
app.use('/api/bookings',bookingRoute)


app.all('*',(req,resp,next)=>{
    resp.status(404).json({
        status:'fail',
        message: `can not find ${req.originalUrl} on this server`
    })
})


module.exports = app;