const jwt = require('jsonwebtoken');
module.exports = (req,resp,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        let verify = jwt.verify(token,'this-is-secreate-key')
        if(verify){
            next();
        }
        else{
            return resp.status(401).json({
                message:'You are not logged in! please provide logintoken'
            })
        }
       
    } catch (error) {
        return resp.status(401).json({
            message:'invalid token.. please provide valid token'
        })
    }
  
}