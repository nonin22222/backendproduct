const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.schema");


////ล็อคอิน
module.exports.login = async (req, res) => {
  try {
      if(req.body.username === undefined || req.body.username ==='')
      {
          return res.status(200).send({ status: false, message: "กรุณากรอกอีเมล์ หรือ เบอร์โทรศัพท์" })
      }
      if(req.body.password === undefined || req.body.password ==='')
      {
          return res.status(200).send({ status: false, message: "กรุณากรอก password" })
      }
      const username = req.body.username
      const password = req.body.password
      
      //เช็คว่า user นี้มีในระบบไหม
      const user = await User.findOne({username:req.body.username})
    
      let bcryptpassword
     
      if(user)
      {
          bcryptpassword = await bcrypt.compare(password,user.password)
          if(bcryptpassword)
          {
              const payload = {
                  _id:user._id,
                  name:user.name,
                  position:user.position
              }
              const secretKey = process.env.SECRET_KEY
              const token = jwt.sign(payload,secretKey,{expiresIn:"30D"})
              return res.status(200).send({ status: true, data: payload, token: token})
          }else{
              return res.status(200).send({ status: false, message: "คุณกรอกรหัสไม่ถูกต้อง" })
          }
      }else{
          return res.status(404).send({ status: false, message: "ไม่มีไอดีนี้อยู่ในระบบ" })
      }


    } catch (error) {
      return res.status(500).send({status:false,error:error.message});
    } 
}
// get me
module.exports.getme = async (req,res) =>{
  try {  

      let token = req.headers['token'];

      if(!token){
          return res.status(403).send({status:false,message:'Not authorized'});
      }
      const secretKey = "i#ngikanei;#aooldkhfa'"
      //เช็ค if ว่า 6ตัวแรก มีคำว่า Bearer ไหม
      if (token.startsWith("Bearer ")) {
          token = token.replace(/^Bearer\s+/, "");
          // ทำการยืนยันสิทธิ์ token
          const decodded =jwt.verify(token,secretKey)
          const dataResponse ={
            _id:decodded._id,
            name:decodded.name,
            position:decodded.position
          }
      return res.status(200).send({status:true,data:dataResponse});
      }else{
          return res.status(403).send({status:false,message:'token ไม่ถูกต้องตามรบบ '})
      }

  } catch (error) {
        console.log(error);
        return res.status(500).send({status:false,error:error.message});
  }
}

// สมัครสมาชิก
module.exports.register = async (req, res) => {
  try {
      if(req.body.username === undefined || req.body.username ==='')
      {
          return res.status(200).send({ status: false, message: "กรุณากรอกอีเมล์ หรือ เบอร์โทรศัพท์" })
      }
      if(req.body.password === undefined || req.body.password ==='')
      {
          return res.status(200).send({ status: false, message: "กรุณากรอก password" })
      }
      if(req.body.name === undefined || req.body.name ==='')
      {
          return res.status(200).send({ status: false, message: "กรุณากรอกชื่อ" })
      }
      const username = req.body.username
      const password = req.body.password
      const name = req.body.name
      
      //เช็คว่า user นี้มีในระบบไหม
      const user = await User.findOne({username:req.body.username})
      if(user)
      {
          return res.status(200).send({ status: false, message: "มีไอดีนี้อยู่ในระบบแล้ว" })
      }
      const hashpassword = await bcrypt.hash(password,8)
      const newUser = new User({
          username:username,
          password:hashpassword,
          name:name
      })
      await newUser.save()
      return res.status(200).send({ status: true, message: "สมัครสมาชิกสำเร็จ"})

    } catch (error) {
      return res.status(500).send({status:false,error:error.message});
    } 
}


