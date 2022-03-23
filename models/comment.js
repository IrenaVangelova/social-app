const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'post'
  },
  likes: {
    type: Array,
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('comment', commentSchema);