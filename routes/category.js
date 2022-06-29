const express = require('express')
const router = express.Router()
const Schema = require("../Schemas");
const verifyToken = require('../helpers/verifyToken');
const { v4: uuidv4 } = require('uuid');


router.get("/category/:category", verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const id = req.params.category;
        Schema.Category.find({_id:id,status : true}, (err,found)=>{
            if(err){
                res.send({status : 0, message : "Error in getting the category", data : {}}); 
            }else{
                if(found){
                    res.send({status : 1, message : "category found",data : found })
                }else{
                    res.send({status : 2, message : "category not found", data : {}}); 
                }
            }
        })
    }
})

router.post("/category", verifyToken, (req,res)=>{
    if(!res.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const name=req.body.name;
        const _id = uuidv4();
        const status = true;
        const createdBy = req.body.createdBy;
        const category = new Schema.Category({
            name : name,
            _id : _id,
            status : status,
            createdBy : createdBy
        })
        category.save((err)=>{
            if(err){
                res.send({status : 0, message : "Error in creating Category", data : {}});
            }else{
                res.send({status : 1, message : "Category Created Successfully", data : {}});
            }
        })
    }
})


router.put("/category",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const categoryID = req.body.id;
        const name = req.body.name;
        
        Schema.Category.findByIdAndUpdate(categoryID,{ name: name},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in updating Category", data : {}});
            }else{
                if(updated){
                    const oldCategory =updated.category;
                    Schema.Product.updateMany({category:oldCategory}, {category:name},(err)=>{
                        if(err){
                            res.send({status : 0, message : "Error in updating Product Category", data : {}});
                        }else{
                            res.send({status : 1, message : "Category updated successfully", data : {}});
                        }
                    })
                }else{
                    res.send({status : 2, message : "Category does not exist", data : {}});
                }
            }
        })
    }
})



router.delete("/category",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const categoryID = req.body.id;
        
        Schema.Category.findByIdAndUpdate(categoryID,{ status : false},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in updating Category", data : {}});
            }else{
                if(updated){
                    Schema.Product.updateMany({category: updated.category}, {status:false},(err)=>{
                        if(err){
                            res.send({status : 0, message : "Error in updating Product Category", data : {}});
                        }else{
                            res.send({status : 1, message : "Category updated successfully", data : {}});
                        }
                    } )
                }else{
                    res.send({status : 2, message : "Category does not exist", data : {}});
                }
            }
        })
    }
})
