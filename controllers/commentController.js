const mongoose = require('mongoose');
const Comment = require('../models/comment');
const response = require('../lib/response_handler');

const getAll = async (req, res) => {

  const comments = await Comment.find().populate({
    path: 'post',
    populate: {
      path: 'user'
    }
  })

  res.send({
    error: false,
    message: `All comments from the database`,
    comments: comments
  });
};

const getById = async (req, res) => {

  const comments = await Comment.findById(req.params.id);

  res.send({
    error: false,
    message: `Comment with id #${comments._id}, has been fetched`,
    comments: comments,
  });
};

const postCreate = async (req, res) => {

  const comment = await Comment.create(req.body);

  res.send({
    error: false,
    message: 'New comment has been created',
    comment: comment
  });
};

const postUpdate = async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, req.body);
  const comment = await Comment.findById(req.params.id);

  res.send({
    error: false,
    message: `Comment with id #${post._id} has been updated`,
    comment: comment
  });
};

const getDeleted = async (req, res) => {

  await Comment.findByIdAndDelete(req.params.id);

  res.send({
    error: false,
    message: `Comment with id #${req.params.id} has been deleted`
  });
};

const likeAndDislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment.likes.includes(req.body.user)) {
      await Comment.updateOne({ $push: { likes: req.body.user } });
      response(res, 200, 'The comment has been liked');
    } else {
      await Comment.updateOne({ $pull: { likes: req.body.user } });
      response(res, 200, 'The comment has been disliked');
    }
  } catch (err) {
    response(res, 500, err)
  }
};

module.exports = {
  getAll,
  getById,
  postCreate,
  postUpdate,
  getDeleted,
  likeAndDislikeComment
}