const express = require('express')
const router = express.Router()
const Schema = require("../Schemas");
const { v4: uuidv4 } = require('uuid');
const md5 = require("md5"); 
const verifyToken = require('../helpers/verifyToken');

var randtoken = require('rand-token');

router.post("/user",verifyToken, (req,res)=>{
    if(req.user){
        const userId = req.body.id;
        console.log(userId)
        Schema.User.findOne( {_id : userId, status:true},(error, found)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in finding the user", data : {}});
            }else{
                
                console.log(found)
                if(found){
                    res.send({status : 1, message : "User Found", data : {name : found.name, id:found.id, status:found.status,email:found.email}});
                }else{
                    res.send({status : 2, message : "No user exists", data : {}});
                }
                
            }
        })
       
    }else{
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }
    
})
router.post("/register",(req,res)=>{
    const name = req.body.name;
    const id = uuidv4();
    const password = md5(req.body.password);
    const status  = true;
    const email = req.body.email;

    const user = new Schema.User({
        name : name,
        password : password,
        _id : id,
        status : status,
        email : email,
        resetToken : randtoken.generate(8)
    })
    Schema.User.find({email : email},(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Server error", data : {}});
        }else{
            if(found.length>0){
                res.send({status : 2, message : "User Already Exists", data : found});
            }else{
                user.save((err)=>{
                    if (err){
                        res.send({status : 0, message : "Error in creating user", data : {}});
                        console.log(err)
                    }
                    else{
                        res.send({status : 1, message : "User created successfully", data : {}});
                    }
                });
            }
        }
    })
})
router.put("/user",verifyToken,(req,res)=>{

    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const userId = req.body.id;
        const name = req.body.name;
        Schema.User.findByIdAndUpdate(userId,{ name: name},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in updating user", data : {}});
            }else{
                console.log(updated);
                if(updated){
                    res.send({status : 1, message : "User updated successfully", data : updated});
                }else{
                    res.send({status : 2, message : "User does not exist", data : {}});
                }
                
            }
        })
    }
   
})

router.delete("/user",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const userId = req.body.id;
        const status = false;
        Schema.User.findByIdAndUpdate(userId,{status: status},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in deleting user", data : {}});
            }else{
                if(updated){
                    res.send({status : 1, message : "User deleted successfully", data : {}});
                }else{
                    res.send({status : 2, message : "User does not exist", data : {}});
                }
                
            }
        })
    }
    
})

router.get("/users",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const searchParam = req.body.search || "";
    Schema.User.find({name:{$regex: searchParam, options:"i"},status:true},(error, found)=>{
        if(error){
            console.log(error);
            res.send({status : 0, message : "Error in finding users", data : {}});
        }else{
            res.send({status : 1, message : "Users fetched", data : found});
        }
    })}
})


module.exports = router;