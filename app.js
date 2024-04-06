var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cor = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

process.env.TZ='UTC'
var app = express();
//เชื่ิอมdatabase
const urldatabase =process.env.ATLAS_MONGODB
mongoose.Promise = global.Promise
mongoose.connect(urldatabase).then(()=>console.log("connect")).catch((err)=>console.error(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '300mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cor())
//router
const prefix = '/v1/BackendProduct'
app.use(prefix+'/', require('./routes/index'));
//ล็อคอิน
app.use(prefix+'/login', require('./routes/login'));

//สินค้า
app.use(prefix+'/product', require('./routes/product'));

//ลูกค้า
app.use(prefix+'/user', require('./routes/user'));

//รีวิว
app.use(prefix+'/review', require('./routes/review'));





app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // หรือกำหนด origin ที่เฉพาะเจาะจง
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const port = process.env.PORT || 5713;
app.listen(port, console.log(`Listening on port ${port}`));



