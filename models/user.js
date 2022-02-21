const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);