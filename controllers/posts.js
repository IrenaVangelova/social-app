
const Post = require('../models/post');
const axios = require('axios');
const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const response = require('../lib/response_handler');
const cron = require('../jobs/cronjob');
const nodemailer = require('nodemailer');


ac.grant('user').createOwn('post');
ac.deny('admin').createOwn('post');

const all = async (req, res) => {

  // const getApiResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=42&lon=21&units=metric&appid=${process.env.WEATHER_API_URL}`);
  // console.log(getApiResponse.data.main) 

  const posts = await Post.find().populate('user');

  res.send({
    error: false,
    message: `All posts from the database`,
    posts: posts
  });
};

const byId = async (req, res) => {

  const posts = await Post.findById(req.params.id);

  res.send({
    error: false,
    message: `Post with id #${posts._id}, has been fetched`,
    posts: posts,
  });
};

const create = async (req, res) => {

  // var config ={
  //   method: 'get',
  //   url: `http://api.openweathermap.org/data/2.5/weather?lat=41.9981&lon=21.4254&units=metric&appid=${process.env.WEATHER_API_URL}`,
  //   headers: {
  //     'api-key': `${process.env.WEATHER_API_URL}`
  //   }
  // }

  // const responseWeather = await axios(config);
  // req.body.weatherCity = responseWeather.data.name
  // req.body.weatherTemp= responseWeather.data.main.temp;


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

const update = async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  const post = await Post.findById(req.params.id);

  res.send({
    error: false,
    message: `Post with id #${post._id} has been updated`,
    post: post
  });
};

const remove = async (req, res) => {

  const post = await Post.findById(req.params.id);
  await Post.findByIdAndDelete(req.params.id);
  post.comments.forEach(async (commentId) => {
    await Comment.findByIdAndDelete(commentId);
  });

  res.send({
    error: false,
    message: `Post with id #${req.params.id} has been deleted`
  });
};

const likeAndDislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.user)) {
      await Post.updateOne({ $push: { likes: req.body.user } });
      response(res, 200, 'The post has been liked');
    } else {
      await Post.updateOne({ $pull: { likes: req.body.user } });
      response(res, 200, 'The post has been disliked');
    }
  } catch (err) {
    response(res, 500, err)
  }
};

module.exports = {
  all,
  byId,
  create,
  update,
  remove,
  likeAndDislike
}