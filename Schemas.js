const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  _id: String,
  password: String,
  status : Boolean,
  email : String,
  resetToken : String,
});
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  _id: String,
  price: Number,
  status: Boolean,
  quantity : Number,
  category: String,
  createdBy: String,
});

const Product = mongoose.model("Product", productSchema);

const categorySchema = new mongoose.Schema({
  _id : String,
  name: String,
  status: Boolean,
  createdBy : String,
});

const Category = mongoose.model("Category", categorySchema);





module.exports = {User, Product, Category}