const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  payment: {
    type: mongoose.Types.ObjectId,
    ref: 'payment'
  }
}, { timestamps: true });

module.exports = mongoose.model('transaction', transactionSchema);