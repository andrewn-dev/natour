const mongoose  = require ('mongoose');
const bcrypt = require('bcrypt')
const userModel = new mongoose.Schema({
    name: {
        type:String,
        required:[true,'please tell us ypur name']
    },
    email:{
        type: String,
        required:[true,'pleas provide your email'],
        unique:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:[true,'please provide ypur password'],
        minlength:8
    },
    confirmPassword : {
        type:String,
        required:[true,'please provide your confirm password'],
        validate:{
            validator: function(el){
                return el === this.password
            },
            message:'password dosent match'
        }
    },
    token:{
        type:String,
        default:''
    },
    photo:{
        type:String,
        required:[true,'A user photo should not be empty']
    }
})
userModel.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined;
    next();
})

module.exports = mongoose.model('User',userModel)