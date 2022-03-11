
const Post = require('../models/post');
const axios = require('axios');
const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const responseHandler = require('../lib/response_handler');
const cron = require('../jobs/cronjob');
const nodemailer = require('nodemailer');

ac.grant('user').createOwn('post');
ac.deny('admin').createOwn('post');

const getAll = async (req, res) => {

  // const getApiResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=42&lon=21&units=metric&appid=${process.env.WEATHER_API_URL}`);
  // console.log(getApiResponse.data.main) 

  const posts = await Post.find().populate('user');
     
  res.send({
    error: false,
    message: `All posts from the database`,
    posts: posts
  });
};

const getById = async (req, res) => {

    const posts = await Post.findById(req.params.id);

    res.send({
      error: false,
      message: `Post with id #${posts._id}, has been fetched`,
      posts: posts,
    });
};

const postCreate = async (req, res) => {

  var config ={
    method: 'get',
    url: `http://api.openweathermap.org/data/2.5/weather?lat=41.9981&lon=21.4254&units=metric&appid=${process.env.WEATHER_API_URL}`,
    headers: {
      'api-key': `${process.env.WEATHER_API_URL}`
    }
  }

  const responseWeather = await axios(config);
  req.body.weatherCity = responseWeather.data.name
  req.body.weatherTemp= responseWeather.data.main.temp;


  const permissions = ac.can(req.user.role).createOwn('post');

  if(!permissions.granted){
    responseHandler(res,401, `Cannot create post with role : ${req.user.role}`);
    return;
  }

  const post = await Post.create(req.body);

  res.send({
    error: false,
    message: 'New post has been created',
    post: post
  });
};

const postUpdate = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  const post = await Post.findById(req.params.id);
                                                      
  res.send({
    error: false,
    message: `Post with id #${post._id} has been updated`,
    post: post
  });
};

const getDeleted = async (req, res) => {

  await Post.findByIdAndDelete(req.params.id);

  res.send({
    error: false,
    message: `Post with id #${req.params.id} has been deleted`
  });
};

module.exports = { 
    getAll,
    getById, 
    postCreate, 
    postUpdate, 
    getDeleted
}