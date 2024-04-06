const express = require('express');
const router = express.Router();
const review = require('../controllers/review.controller')
const userAuth = require('../authentication/userAuth')

//เพิ่มรีวิว
router.post('/',userAuth.customer,review.add)

//ดึงข้อมูลรีวิวทั้งหมด
router.get('/',userAuth.customer,review.getAllReview)

//ดึงข้อมูลรีวิว by id
router.get('/byid/:id',userAuth.customer,review.getReviewById)

//แก้ไขข้อมูลรีวิว
router.put('/:id',userAuth.customer,review.updateReview)

//ลบข้อมูลรีวิว
router.delete('/:id',userAuth.customer,review.deleteReview)

module.exports = router;