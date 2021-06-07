const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { Quiz } = require('../models/model')
const secret = process.env.SECRET;

function authorizedUser(req, res, next){
    const token = req.headers.authorization;
    try{
        const decode = jwt.verify(token, secret);
        req.body = decode.username;
        return next();
    }catch(e){
        return res.status(401).json({
            success: false,
            result: "Login to play the quiz."
        })
    }
}

router.route('/')
    .get(authorizedUser, async(req, res)=>{
        const quiz = await Quiz.find();
        res.json({
            username: req.body,
            success: true,
            result: quiz
        })
    })

    .post(async(req,res)=>{
        const { quizName, questions } = req.body;
        try{
            const newQuiz = await new Quiz({
                quizName: quizName,
                questions: questions
            })
            const quiz = await newQuiz.save();
            res.json({
                success: true,
                result: `${quiz.quizName} quiz created successfully.`
            })
        }catch(e){
            res.status(409).json({
                success: false,
                error: e.message,
                result: "Failed to create new Quiz."
            })
        }
    })

router.route('/id')
    .get(async(req, res)=>{
        const { quizId } = req.body;
        try{
            const quiz = await Quiz.findById({ _id: quizId});
            res.json({
                success: true,
                result: quiz
            })
        }catch(e){
            res.status(404).json({
                success: false,
                error: e.message,
                result: 'Quiz not found'
            })
        }
    })

module.exports = router