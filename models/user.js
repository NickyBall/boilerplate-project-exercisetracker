const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

exports.UserModel = User;