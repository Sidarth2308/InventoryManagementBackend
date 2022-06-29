const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");
const md5 = require('md5');
const Schema = require("../Schemas");
var randtoken = require('rand-token');
const forgotPasswordEmail = require('../helpers/forgotPasswordEmail');

router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    Schema.User.findOne({email:email},(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Error in finding the user", data : {}});
        }else{
            if(found){
                if(md5(password) == found.password){
                    var token = jwt.sign({id: found._id},process.env.API_SECRET,{expiresIn:86400})
                    res.send({status : 1, message : "User Login Successful", accessToken:token});
                }else{
                    res.send({status : 2, message : "Incorrect Password", data : {}}); 
                }
            }else{
                res.send({status : 2, message : "User does not exist", data : {}});
            }
        }
    })
})

router.post("/login/forgotPassword", (req,res)=>{
    const email = req.body.email;
    Schema.User.findOne({email:email},(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Error in finding the user", data : {}});
        }else{
            if(found){
                forgotPasswordEmail(found.name, email, found.token, found._id)
                .then(success=>{
                    res.send({status : 1, message : success, data : {}});
                })
                .catch(err=>{
                    console.log(err);
                    res.send({status : 0, message : "Error in sending email", data : {}});
                })
            }else{
                res.send({status :2, message : "User does not exist", data : {}});
            }
           
        }
    })
})

router.post("/login/checkPasswordToken", (req,res)=>{
    const token =req.body.token;
    const user = req.body.user;
    Schema.User.findById(user,(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Error in finding the user", data : {}});
        }else{
            if(found){
                if(token === found.token){
                    res.send({status : 1, message : "Token matched", data :{previousPassword : found.password}});
                }else{
                    res.send({status : 2, message : "Incorrect Token", data : {}}); 
                }
            }else{
                res.send({status : 2, message : "User does not exist", data : {}});
            }
            
        }
    })
})
router.post("/login/updatePassword", (req,res)=>{
    const user = req.body.user;
    const newToken = randtoken.generate(8);
    const password = md5(req.body.user);
    Schema.User.findByIdAndUpdate(user,{token:newToken, password:password},(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Error in finding the user", data : {}});
        }else{
            if(found){
                res.send({status : 1, message : "Password changed successfully", data :{}});
            }else{
                res.send({status : 2, message : "User does not exist", data : {}});
            }
            
        }
    })
    
})
module.exports = router;