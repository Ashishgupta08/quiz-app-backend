const mongoose = require('mongoose')
const { Schema } = mongoose

const quizSchema = new Schema({
    quizName: { type: String, unique: true, index: true, required: true },
    questions: [
        {
            questionName: { type: String },
            options: [
                {
                    answer: { type: String },
                    isCorrect: { type: Boolean }
                },
            ]
        },
    ]
},{timestamps: true})
const Quiz = mongoose.model('Quiz', quizSchema)

module.exports = { Quiz }