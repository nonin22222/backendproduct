const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");

//ดึงข้อมูล user ทั้งหมด
module.exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find()
        return res.status(200).send({ status: true, data: user })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
//ดึงข้อมูล user by id
module.exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).send({ status: true, data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
//แก้ไขข้อมูล user
module.exports.updateUser = async (req, res) => {
    try {
        
        const userdata = await User.findById(req.params.id)
        if(!userdata)   return res.status(404).send({ status: false, message: "ไม่พบข้อมูล user นี้" })

        const data ={
            username:req.body.username,
            password: (req.body.password != null &&req.body.password !=undefined? await bcrypt.hash(req.body.password,8):userdata.password) ,
            name:req.body.name,
            position:req.body.position
        }

        const user = await User.findByIdAndUpdate(req.params.id,data , { new: true })
        return res.status(200).send({ status: true,message:"ล็อคอินสำเร็จ", data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ลบข้อมูล user
module.exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        return res.status(200).send({ status: true, data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
