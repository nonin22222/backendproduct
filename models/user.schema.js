const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema(
  {
    username:{type:String,require:true,unique: true},
    password: {type: String, required: true},
    name:{type:String,required:true},
    position:{type:String,required:true},
  },
  {timestamps: true}
);

const User = mongoose.model("user", UserSchema);




module.exports = User;