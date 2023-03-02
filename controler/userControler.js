const User = require('../model/userModel');

exports.getAlluser =  (req,resp)=>{
    User.find().then((data)=>{
        resp.send(data)
    }).catch((Err)=>{
        resp.send(Err)
    })
}

exports.getUser =  (req,resp)=>{
    User.findById(req.params.id).then((data)=>{
        resp.send(data)
    }).catch((Err)=>{
        resp.send(Err)
    })
}

exports.updateUser = (req,resp)=>{
    User.findByIdAndUpdate(req.params.id,req.body).then((data)=>{
        resp.status(200).json({
            msg: 'success',
            data:{
                data
            }
        })
    }).catch((err)=>{
        resp.status(404).json({
            msg : 'fail to update!!'
        })
    })
}

exports.deleteUser = (req,resp)=>{
    User.findByIdAndDelete(req.params.id).then((data)=>{
        resp.status(200).json({
            msg: 'success',
            data: data
        })
    }).catch((err)=>{
        resp.status(404).json({
            msg: 'fail to delete!!'
        })
    })
}

exports.updateMe = async (req,resp)=>{
    try {
        console.log(req.file);
        console.log(req.body);
        resp.status(200).json({status:'success',msg:'file uploded'})
        
    } catch (error) {
        resp.status(400).json({status:'fail',msg:error.message})
        
    }
}