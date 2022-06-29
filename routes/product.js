const express = require('express')
const router = express.Router()
const Schema = require("../Schemas");
const verifyToken = require('../helpers/verifyToken');
const { v4: uuidv4 } = require('uuid');

router.get("/product/:product", verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const id = req.params.product;
        Schema.Product.find({_id:id,status : true}, (err,found)=>{
            if(err){
                res.send({status : 0, message : "Error in getting the product", data : {}}); 
            }else{
                if(found){
                    res.send({status : 1, message : "Product found",data : found })
                }else{
                    res.send({status : 2, message : "Product not found", data : {}}); 
                }
            }
        })
    }
})
router.post("/product", verifyToken, (req,res)=>{
    if(!res.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const name=req.body.name;
        const _id = uuidv4();
        const price = req.body.price || 0;
        const status = true;
        const quantity = req.body.quantity || 0;
        const category = req.body.category;
        const createdBy = req.body.createdBy;

        const product = new Schema.Product({
            name : name,
            _id : _id,
            price : price,
            status : status,
            quantity : quantity,
            category : category,
            createdBy : createdBy
        })
        product.save((err)=>{
            if(err){
                res.send({status : 0, message : "Error in creating product", data : {}});
            }else{
                res.send({status : 1, message : "Product Created Successfully", data : {}});
            }
        })
    }
})

router.put("/product",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const productID = req.body.id;
        const name = req.body.name;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const category = req.body.category;
        Schema.Product.findByIdAndUpdate(productID,{ name: name, price : price, quantity : quantity, category:category},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in updating product", data : {}});
            }else{
                if(updated){
                    res.send({status : 1, message : "Product updated successfully", data : {}});
                }else{
                    res.send({status : 2, message : "Product does not exist", data : {}});
                }
                
            }
        })
    }
})
router.delete("/product",verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const productID = req.body.id;
        const status = false;
        Schema.Product.findByIdAndUpdate(productID,{ status : status},(error,updated)=>{
            if(error){
                console.log(error);
                res.send({status : 0, message : "Error in updating product", data : {}});
            }else{
                if(updated){
                    res.send({status : 1, message : "Product deleted successfully", data : {}});
                }else{
                    res.send({status : 2, message : "Product does not exist", data : {}});
                }
                
            }
        })
    }
})


router.get("/products", verifyToken,(req,res)=>{
    if(!req.user){
        res.send({status : 0, message : "Invalid JWT token", data : {}});
    }else{
        const searchParam = req.body.search || "";
        Schema.Product.find({name:{$regex: searchParam, options:"i"},status : true}, (err,found)=>{
            if(err){
                res.send({status : 0, message : "Error in getting the product", data : {}}); 
            }else{
                if(found){
                    res.send({status : 1, message : "Product found",data : found })
                }else{
                    res.send({status : 2, message : "Product not found", data : {}}); 
                }
            }
        })
    }
})

module.exports = router;