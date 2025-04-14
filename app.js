const createError = require('http-errors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const photosRouter = require('./routes/photos');
const apiPhotosRouter = require('./routes/api/api-photos');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.akr8ltf.mongodb.net/assignment5?retryWrites=true&w=majority&appName=Cluster0`)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('cscie31-secret'));
app.use(session({
  secret: 'cscie31',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//routes setup
app.use('/', indexRouter);
app.use('/photos', photosRouter);
app.use('/api/photos', apiPhotosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
