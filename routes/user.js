const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller')
const userAuth = require('../authentication/userAuth')

//ดึงข้อมูล user ทั้งหมด
router.get('/',userAuth.customer,user.getAllUser)

//ดึงข้อมูล user by id
router.get('/byid/:id',userAuth.customer,user.getUserById)

//แก้ไขข้อมูล user
router.put('/:id',userAuth.customer,user.updateUser)


//ลบข้อมูล user
router.delete('/:id',userAuth.customer,user.deleteUser)


module.exports = router;