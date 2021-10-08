const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, index: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String },
  gender: { type: String },
  score: [
    {
      quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
      score: { type: Number }
    },
  ],
}, { timestamps: true })
const User = mongoose.model('User', userSchema)

module.exports = { User }