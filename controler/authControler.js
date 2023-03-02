const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const randomString = require("randomstring");
const multer = require('multer');
const User  = require('../model/userModel');
const config = require('./config/config')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images/user');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now() + file.originalname)
    }
    
})

const uploads  = multer({storage:storage})

exports.uploadUserPhoto = uploads.single('photo');

const sendResetPasswordMail = async (name,email,token)=>{
    try {
        const trasnporter =  nodeMailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.password
            }
        });
        const mailOption = {
            from: config.emailUser,
            to: email,
            subject:'For Reset Password',
            html : '<p> Hyy' +" " + name + ', please copy the link and <a href="http://localhost:4500/api/reset-password?'+token+'"> reset your password </a></p>'
        }
         const info  = await trasnporter.sendMail(mailOption);
         console.log(info.response);
        
    } catch (error) {
        console.log(error);
        
    }
}

function generateToken(user){
    const token = jwt.sign({
        id:user.id,
        name:user.name,
        email:user.email,
        password:user.password,

    },'this-is-secreate-key',{
        expiresIn:"30d"
    });
    user.token = token;
    return {
        token:token
    }; 
}

exports.signup =async (req,resp)=>{
    try {
        console.log(req.file);
        const newUser =await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            photo:req.file.filename
        });;
        resp.status(200).json({
            status:"success",
            data:{
                newUser
            }
        })    
        
    } catch (error) {
        resp.status(400).json({
            status:"fail",
            msg:error.message
        })
        
    }
}

exports.login = async (req,resp)=>{
    try {
        const {email,password} = req.body
        const user =await User.findOne({email:email});
        if(user){
            const passwordMatch = await bcrypt.compare(password,user.password);
            if(passwordMatch){
                const token = await generateToken(user)
                const userResult = { 
                    token,token
                }
                resp.cookie("jwt",userResult,{
                    expires: new Date(Date.now() + 2589200000),
                    httpOnly:true,
                    path:'localhost:4500/api/user/login'
                    // secure:true
                })
                resp.send(userResult)

            }else{
                resp.status(200).json({success:false,msg:'Login details are incorrect'})
            }


        }else{
            resp.status(200).json({success:false,msg:'Login details are incorrect'})
        }
        
    } catch (error) {
        resp.status(400).send(error)
    }
}


exports.forgetPassword = async (req,resp)=>{
    try {
        const email = req.body.email
        const user = await User.findOne({email:email});

        if(user){
            const token = randomString.generate()
            const data = await User.updateOne({email:email},{$set:{token:token}});

            sendResetPasswordMail(user.name,user.email,token)
            resp.status(200).send({success:true,msg:'please check your inbox  and reset your password'})

        }else{
            resp.status(401).json({status:false,msg:'This email does not exist ....'})
        

        }
        
    } catch (error) {
        resp.status(401).json({status:false,msg:error})
        
    }

}

exports.resetPassword = async (req,resp)=>{
    try {
        const token = req.query.token
        // console.log(token);

        const tokenData  = await User.findOne({token:token});
        if(tokenData){
            const password = req.body.password;
            const newPassword = await bcrypt.hash(password, 12);
            const updatedPass = await User.findByIdAndUpdate(tokenData,{password:newPassword,token:''},{new:true});
            resp.status(200).json({status:true,msg:'password reset successfully',data:{updatedPass}})

        }else{
            resp.status(200).json({status:true,msg:"token expire!"})
        }

        
    } catch (error) {
        resp.status(400).json({status:false,msg:error.message});  
    }
}

