const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const commentRoute = require('./routes/commentRoute');
const importRoute = require('./routes/importRoute');


// MVC: Model View Controller

const app = express();
mongoose.connect('mongodb://localhost:27017/social-app');


require('dotenv').config();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Social network API",
      description: "Users posting and commenting on stuff",
      contact: {
        name: "Irena Vangelova",
      },
      tags: [
        {
        name: "users",
        description: "All users from database"
        },
        {
        name: "posts",
        description: "All posts from database"
        },
        {
          name: "comments",
          description: "All comments from database"
        }
      ],
      servers: ["http://localhost:3000"],
    },
  },
  //Routes defined
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/posts', postRoute);
app.use('/users', userRoute);
app.use('/comments', commentRoute);
app.use('/import', importRoute);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
