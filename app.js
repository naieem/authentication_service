import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import api from './routes/api';
import cors from 'cors';
import redis from 'redis';
import mongoose from 'mongoose';

// ======================================
// redis client setup ===================
// ======================================
var redisClient = redis.createClient(); //creates a new client
// check if connection is ok
redisClient.on('connect', function() {
    console.log('redis connected');
});
// ======================================
// mongoose =============================
// ======================================
mongoose.connect('mongodb://localhost/workflow');
var db = mongoose.connection;
db.on('error', function() {
    console.log('------------------------------------');
    console.log('mongodb not connected');
    console.log('------------------------------------');
});
db.once('open', function() {
    console.log('------------------------------------');
    console.log('mongodb connected');
    console.log('------------------------------------');
});
// ======================================
// mongoose ends ========================
// ======================================
var app = express();
app.use(cors()); // cros origin resource sharing activated
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api); // api routing 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
export default app;