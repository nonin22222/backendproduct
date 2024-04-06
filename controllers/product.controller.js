const Product = require("../models/product.schema");
const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../functions/uploadfilecreate");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

//เพิ่มสินค้า
module.exports.add = async (req, res) => {
    try {
      let upload = multer({ storage: storage }).array("image", 20);
      upload(req, res, async function (err) {
        const reqFiles = [];
        const result = [];
        if (err) {
          return res.status(500).send(err);
        }
        let image = '' // ตั้งตัวแปรรูป
        //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
        if (req.files) {
          const url = req.protocol + "://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            const src = await uploadFileCreate(req.files, res, { i, reqFiles });
            result.push(src);
          
            //   reqFiles.push(url + "/public/" + req.files[i].filename);
          }
          image = reqFiles[0]
        }
  
  
        const data = new Product({
          name: req.body.name,
          price: req.body.price,
          detail: req.body.detail,
          image: image,
        });
  
        
        const add = await data.save();
        return res
          .status(200)
          .send({
            status: true,
            message: "เพิ่มสินค้าสำเร็จ",
            data: add,
          });
      });
      
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
};

//ดึงข้อมูลสินค้าทั้งหมด
module.exports.getAllProduct = async (req, res) => {
    try {
        const product = await Product.find()
        return res.status(200).send({ status: true, data: product })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//ดึงข้อมูลสินค้า by id
module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.status(200).send({ status: true, data: product })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//แก้ไขข้อมูลสินค้า
module.exports.updateProduct = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      const product = await Product.findById(req.params.id)
      if(!product) return res.status(404).send({status:false,message:'ไม่พบสินค้า'})
      let image = '' // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        image = reqFiles[0]
      }


        const data={
          name: req.body.name,
          price: req.body.price,
          detail: req.body.detail,
          image: (image !='' ?  image:product.image),
        }
        const update = await Product.findByIdAndUpdate(req.body.id, data, { new: true })
        return res.status(200).send({ status: true, data: update })
  
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}


//ลบข้อมูลสินค้า
module.exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        return res.status(200).send({ status: true, data: product })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}