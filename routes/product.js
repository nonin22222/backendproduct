const express = require('express');
const router = express.Router();
const product = require('../controllers/product.controller')
const userAuth = require('../authentication/userAuth')
//เพิ่มสินค้า
router.post('/',userAuth.customer,product.add)

//ดึงข้อมูลสินค้าทั้งหมด
router.get('/',userAuth.customer,product.getAllProduct)

//ดึงข้อมูลสินค้า by id
router.get('/byid/:id',userAuth.customer,product.getProductById)

//แก้ไขข้อมูลสินค้า
router.put('/:id',userAuth.customer,product.updateProduct)

//ลบข้อมูลสินค้า
router.delete('/:id',userAuth.customer,product.deleteProduct)

module.exports = router;