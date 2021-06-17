const express = require('express')
const router = express.Router()
const { Quiz } = require('../models/quiz.model')
const { authorizedUser } = require('../utils/authorizedUser')

router.route('/')

  .get(authorizedUser, async (req, res) => {
    try {
      const quiz = await Quiz.find();
      res.json({
        success: true,
        result: quiz
      })
    } catch (e) {
      console.log(e.message);
      res.status(501).json({
        success: false,
        error: e.message,
        result: 'Unable to fetch data.'
      })
    }

  })

  .post(authorizedUser, async (req, res) => {
    const { quizName, questions } = req.body;
    try {
      const newQuiz = await new Quiz({
        quizName: quizName,
        questions: questions
      })
      const quiz = await newQuiz.save();
      res.json({
        success: true,
        result: `${quiz.quizName} quiz created successfully.`
      })
    } catch (e) {
      console.log(e.message);
      res.status(409).json({
        success: false,
        error: e.message,
        result: "Failed to create new Quiz."
      })
    }
  })

router.route('/:id')

  .get(authorizedUser, async (req, res) => {
    const { id } = req.params;
    try {
      const quiz = await Quiz.findById({ _id: id });
      res.json({
        success: true,
        result: quiz
      })
    } catch (e) {
      console.log(e.message);
      res.status(404).json({
        success: false,
        error: e.message,
        result: 'Quiz not found'
      })
    }
  })

module.exports = router