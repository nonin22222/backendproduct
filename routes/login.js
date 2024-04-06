const express = require('express');
const router = express.Router();
const login = require('../controllers/login.controller')
const userAuth = require('../authentication/userAuth')


//ล็อคอิน
router.post('/',login.login)

// get me
router.get('/getme',login.getme)

// สมัครสมาชิก
router.post('/register',login.register)






module.exports = router;