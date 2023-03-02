const mongoose  = require('mongoose');
const tourSchemam = new mongoose.Schema({
    name: {
      type:String,
      required:[true,'Name should not be empty.'],
      unique:true
    },
    duration: String,
    maxGroupSize:Number,
    difficulty:{
      type:String,
      required:[true, 'A tour must have difficulty'],
      default:'easy',
      enum:{
        values:['easy','medium','difficult'],

      }

    } ,
    ratingsAverage: {
      type:String,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type:Number,
      default:0
    },
    price: {
      type:Number,
      required:[true,'A tour must have price.']
    },
    summary: {
      type:String
    },
    description:{
      type:String
    },
    images:[String],
    startLocaction:{
      type:{
        type:String,
        default:'point',
        enum:['point']
      },
      coordinates:[Number],
      address:String,
      description:String
    },
    location:[
      {
        type:{
          type:String,
          default:'point',
          enum:['point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    guides:[
      {
        type:mongoose.Types.ObjectId,
        ref:'User'
      }
    ]
});

// document middleware 

// tourSchemam.pre('save',  async function (next){
//    const guidesPromise =  this.guides.map(async id => await User.findById(id))
//    this.guides = await Promise.all(guidesPromise);
//    next();
// })

// tourSchemam.pre(/^find/,function(next){
//   this.populate('guides')
//   next();
// })
module.exports = mongoose.model('Tour',tourSchemam)