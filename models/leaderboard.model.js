const mongoose = require('mongoose')
const { Schema } = mongoose

const leaderBoardSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', unique: true, index: true },
  leaderBoard: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number }
    },
  ],
}, { timestamps: true })
const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema)

module.exports = { LeaderBoard }