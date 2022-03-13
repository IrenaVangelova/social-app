const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  likes: {
    type: Array,
    default: []
  },
  weatherCity: {
    type: String,
    required: false
  },
  weatherTemp: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);