const jwt = require("jsonwebtoken");
const Schema = require("../Schemas");

const verifyToken = (req,res,next)=>{
    if(req.headers && req.headers.authorization){
        jwt.verify(req.headers.authorization, process.env.API_SECRET,(err,decode)=>{
            if(err){
                req.user=undefined;
                next();
            }
            Schema.User.findById(decode.id,(error, user)=>{
                if(error){
                    res.send({status : 0, message : "Error in token", data : {}});
                }else{
                    req.user = user;
                    next();
                }
            })
        })
    }else{
        req.user = undefined;
        next();
    }
}
module.exports = verifyToken;