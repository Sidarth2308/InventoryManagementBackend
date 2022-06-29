require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(loginRouter);
app.use(productRouter);
app.use(categoryRouter);
const url = `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPASS}@cluster0.hrqkb.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


app.get("/",(req,res) => {
  res.send(`Server running on PORT : ${PORT}`);
})

app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
