const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('./models/user').UserModel;
const Exercise = require('./models/exercise').ExerciseModel;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users').get(async (req, res) => {
  const users = await User.find({});
  res.json(users);
}).post(async (req, res) => {
  const { username } = req.body;
  const newUser = new User({ username: username });
  await newUser.save();
  res.json(newUser);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;

  let user;
  try {
    user = await User.findById(userId);
  } catch { }

  if (!user) return res.json({ error: 'User not found' });

  const newExercise = new Exercise({
    userId: userId,
    username: user.username,
    description: description,
    duration: duration,
    date: date ? new Date(date) : new Date()
  });

  await newExercise.save();

  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString()
  });

});

app.get('/api/users/:_id/logs', async (req, res) => {

  const userId = req.params._id;
  const { from, to, limit } = req.query;

  let user;
  try {
    user = await User.findById(userId);
  } catch { }

  if (!user) return res.json({ error: 'User not found' });
  
  try {
    const exercises = await Exercise
      .find({
        userId: userId,
        date: {
          $gt: from ? new Date(from) : new Date('1970-01-01'),
          $lt: to ? new Date(to) : new Date()
        }
      })
      .limit(limit ? parseInt(limit) : 10);
    res.json({
      _id: user._id,
      count: exercises.length,
      username: user.username,
      log: exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }))
    });
  } catch (err) {
    console.log(err);
    res.json({
      trace: err,
      error: 'Error occur'
    });
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
