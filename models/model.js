const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: { type: String, lowercase: true, unique: true, index: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
	email: { type: String, required: true },
	contact: { type: String },
	gender: { type: String }
},{timestamps: true})
const User = mongoose.model('User', userSchema)

const quizSchema = new Schema({
    quizName: { type: String, unique: true, index: true, required: true },
    questions: [
        {
            questionName: { type: String },
            options: [
                {
                    answer: { type: String },
                    isCorrect: { type: Boolean }
                }
            ]
        }
    ]
},{timestamps: true})
const Quiz = mongoose.model('Quiz', quizSchema)

const leaderBoardSchema = new Schema({
    
},{timestamps: true})
const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema)

module.exports = { User, Quiz, LeaderBoard }