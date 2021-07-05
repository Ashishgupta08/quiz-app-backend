const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require('../models/user.model')
const { authorizedUser } = require('../utils/authorizedUser')
const secret = process.env['SECRET'];

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username: username })
    if (user === null) {
      return res.status(404).json({
        success: false,
        result: "No user found"
      })
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = jwt.sign({ username: user.username }, secret, { expiresIn: '24h' });
      res.json({
        success: true,
        result: token
      })
    } else {
      return res.status(401).json({
        success: false,
        result: "Wrong Password"
      })
    }
  } catch (e) {
    console.log(e.message);
    res.status(404).json({
      success: false,
      error: e.message,
      result: "No user found"
    })
  }
})

router.get('/getUserData', authorizedUser, async (req, res) => {
  const { username } = req.body;
  try {
    const userData = await User.findOne({ username: username }).populate({
      path: 'score',
      populate: {
        path: 'quizId',
        populate: 'Quiz',
        select: 'quizName'
      }
    });
    res.json({
      success: true,
      result: userData
    })
  } catch (e) {
    console.log(e.message);
    res.status(501).json({
      success: false,
      error: e.message,
      result: "Unable to fetch data"
    })
  }
})

router.post('/signup', async (req, res) => {
  const { username, password, name, email, contact, gender } = req.body
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username: username,
      password: encryptedPassword,
      name: name,
      email: email,
      contact: contact,
      gender: gender
    })
    const user = await newUser.save();
    const token = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
    res.status(201).json({
      success: true,
      comment: "User created",
      result: token
    })
  } catch (e) {
    console.log(e.message);
    res.status(409).json({
      success: false,
      error: e.message,
      result: 'User not created'
    })
  }
})

router.patch('/updateScore', authorizedUser, async (req, res) => {
  const { username, score } = req.body;
  try {
    const quiz = await User.findOne({ username: username })
    const prevData = quiz.score.find(item => item.quizId.toString() === score.quizId)
    if (prevData) {
      const updatedData = await User.findOneAndUpdate({ username: username, "score.quizId": score.quizId.toString() }, { $set: { "score.$.score": score.score } })
    } else {
      const updatedData = await User.findOneAndUpdate({ username: username }, { $push: { score: score } })
    }
    res.json({
      success: true,
      result: "Successfully Updated"
    })
  } catch (e) {
    console.log(e.message);
    res.status(409).json({
      success: false,
      error: e.message,
      result: "Failed to update"
    })
  }
})

module.exports = router