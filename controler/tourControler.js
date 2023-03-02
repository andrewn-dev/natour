const multer = require('multer');
const Tour = require('../model/tourModel');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images/tour');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now() + file.originalname)
    }
    
})

const uploads  = multer({storage:storage})

exports.uploadTourImages = uploads.fields([
    {name:'images',maxCount:3}
]);

exports. getAllTour  = async (req,resp)=>{
    const tour =await Tour.find();
    resp.status(200).json({
        msg:'success',
        data:{
            tour
        }
    })

}

exports. getTour  = async (req,resp)=>{
    try {
        const tour = await Tour.findById(req.params.id).populate({
            path:'guides',
            select:'name email password '
        });
        if(!tour){
            resp.stasus(404).send("Sorry we can not find tour data on this id")
        }else{
            resp.status(200).json({status:"success",result:tour.length,data:{tour}})
        }
        
    } catch (error) {
        resp.status(400).json({status:"fail",msg:error.message})
        
    }

}

exports. createTour =async (req,resp)=>{
    try {
        const tour  = await Tour.create(req.body);
        resp.status(200).json({stasus:'success',data:{tour}})
        
    } catch (error) {
        resp.status(400).json({status:'fail',msg:error.message})
    }
}

exports.  updateTour = (req,resp)=>{
    console.log(req.file);
    Tour.findByIdAndUpdate(req.params.id,req.body,{
        new: true
    }).then((data)=>{
        resp.send(data)
    }).catch((err)=>{
        resp.send({message:'Error while updating data'})
    })
}

exports. deleteToure =  (req,resp)=>{
    Tour.findOneAndDelete(req.params.id).then((data)=>{
        resp.send(data)
    }).catch((err)=>{
        resp.send(err)
    })
}


exports.getTourStates = async (req,resp)=>{
    const stats =  await Tour.aggregate([
        {
            $match:{ratingsAverage:{$gte:'4.5'}}
        },
        {
            $group :{
                _id :'difficulty',
                numTour: {$sum:1},
                numRating :{$sum:'$ratingsQuantity'},
                avgRating : {$avg:'$ratingsAverage'},
                avgPric : {$avg:'$price'},
                minPrice :{$min:'$price'},
                maxPrice :{$max:'$price'}  

            }
        }
    ]);
    resp.status(200).json({
        status:'success',
        data:{
            stats
        }
    })
}



exports.filterQuery = async (req,resp)=>{
   //  BUILD A QUERY 
   const queryObject = {...req.query};
   const excludeFile = ['page','sort','limit','feilds']
   excludeFile.forEach(el => delete queryObject[el]);

  

   // FILTERING
   // 1 
   
   // Tour.find({
   //     duration:5,
   //     difficulty:"easy"
   // }).then((data)=>{
   //     resp.status(200).json({
   //         status: "success",
   //         result:Tour.length,
   //         data:{
   //             data
   //         }
   //     })
   // }).catch((err)=>{
   //     resp.status(404).json({
   //         message: "Error while finding data", err
   //     })
   // })

   // 1b)  ADVANCE FILTERING 
   let queryString  = JSON.stringify(queryObject);
   queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
   let query = Tour.find(JSON.parse(queryString))

   //  2 sort
   if(req.query.sort){
       const sortBy = req.query.sort.split(',').join(" ")
       console.log(sortBy);
       query = query.sort(sortBy)
   }else{
       query = query.sort('-_v')
   }

   // 3  feilds 
   if(req.query.feilds){
       const feilds   = req.query.feilds.split(',').join(' ')
       query = query.select(feilds);
   }else{
       query = query.select('-_v');
   }

   //  page and limit
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip =  (page - 1) * limit;
   query = query.skip(skip).limit(limit);
 // EXECUTE THE QUERY
   const tour =  await  query;

// SEND THE RESPONSE 
   resp.status(200).json({
       message:'success',
       result: Tour.length,
       data:{
           tour
       }
   })
}