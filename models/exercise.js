const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: Number,
  date: Date
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

exports.ExerciseModel = Exercise;