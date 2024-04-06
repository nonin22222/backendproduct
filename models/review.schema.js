const mongoose = require("mongoose");


const ReviewSchema = new mongoose.Schema(
  {
    Product_id:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    rating:{type:Number,required:true},
    review:{type:String,required:true},
  },
  {timestamps: true}
);

const Review = mongoose.model("Review",ReviewSchema);


module.exports = Review;