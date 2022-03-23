const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const response = require('../lib/response_handler');
const jwt = require('jsonwebtoken');
const Friendship = require('../models/friendship');


const all = async (req, res) => {

  const users = await User.find();

  res.send({
    error: false,
    message: `All users from the database`,
    users: users
  });
};

const byId = async (req, res) => {

  const users = await User.findById(req.params.id);

  res.send({
    error: false,
    message: `User with id #${users._id}, has been fetched`,
    users: users
  });
};

const register = async (req, res) => {

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return response(res, 400, 'Bad request');
    }

    req.body.password = bcrypt.hashSync(req.body.password);

    user = await User.create(req.body);

    response(res, 201, 'New user has been created', { user });
  } catch (error) {
    return response(res, 500, error.msg)
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // token = plain data (JSON payload) + secret key za potpisuvanje na token + config options
        const payload = {
          id: user._id,
          email: user.email,
          first_name: user.first_name,
          role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: '50m'
        });

        response(res, 200, 'You have logged in successfully', { token })
      } else {
        response(res, 401, 'Invalid credentials');
      }
    } else {
      response(res, 401, 'Invalid credentials');
    }
  } catch (error) {
    response(res, 500, error.msg);
  }
}

const followFriend = async (req, res) => {

  if(req.body.user !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.user);
      if(!user.followers.includes(req.body.user)){
        await user.updateOne({$push: {followers: req.body.user}});
        await currentUser.updateOne({$push: {followings: req.params.id}});
        response(res,200, 'user has been followed')
      }else{
        response(res,403, "You already follow this user")
      }
    } catch(err){
      response(res,500,err)
    }
  }
  else {
    response(res, 403 , "You cant follow yourself")
  }
};

const unfollowFriend = async (req, res) => {

  if(req.body.user !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.user);
      if(user.followers.includes(req.body.user)){
        await user.updateOne({$pull: {followers: req.body.user}});
        await currentUser.updateOne({$pull: {followings: req.params.id}});
        response(res,200, 'user has been unfollowed')
      }else{
        response(res,403, "You dont follow this user")
      }
    } catch(err){
      response(res,500, err)
    }
  }
  else {
    response(res, 403 , "You cant unfollow yourself")
  }
};

const update = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  const user = await User.findById(req.params.id);

  res.send({
    error: false,
    message: `User with id #${user._id} has been updated`,
    user: user
  });
};

const addFriend = async (req, res) => {
  console.log(req.user);
  try {
    const userTwo = await User.findById(req.params.id);

    if (!userTwo) {
      response(res, 404, 'Cannot add to friends a user that doesn\'t exist.');
      return;
    }

    const friendship = await Friendship.create({
      user_one: req.user.id,
      user_two: userTwo._id
    })

    response(res, 201, `User with id #${req.user.id} has added to friends user with id #${req.params.id}.`, { friendship })
  } catch (error) {
    response(res, 500, error.message, { error })
  }
}

const deleteFriend = async (req, res) => {
  try {
    await Friendship.findOneAndDelete({
      $or: [
        { 
          $and: [
            { user_one: req.user.id },
            { user_two: req.params.id }
          ] 
        },
        {
          $and: [
            { user_one: req.params.id },
            { user_two: req.user.id }
          ]
        }
      ]
    });

    response(res, 201, `User with id #${req.user.id} has deleted the friendship with user with id #${req.params.id}.`, { friendship })
  } catch (error) {
    response(res, 500, error.message, { error })
  }
}

const remove = async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.send({
    error: false,
    message: `User with id #${req.params.id} has been deleted`
  });
}; 

module.exports = {
  all,
  byId,
  register,
  login,
  update,
  remove,
  followFriend,
  unfollowFriend,
  addFriend,
  deleteFriend
}