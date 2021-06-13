const express = require('express')
const router = express.Router();
const { LeaderBoard } = require('../models/leaderboard.model')
const { authorizedUser } = require('../utils/authorizedUser')

router.get('/',authorizedUser, async (req, res) => {
    try{
        const data = await LeaderBoard.find().populate({ path: 'quizId'}).populate({ path: 'leaderBoard', populate: { path: 'userId', populate: 'User' } });
        res.json({
            success: true,
            result: data
        })
    }catch(e){
        console.log(e.message);
        res.status(501).json({
            success: false,
            error: e.message,
            result: 'Unable to fetch data.'
        })
    }
})

router.post('/',authorizedUser ,async (req, res) => {
    const { quizId, leaderBoard } = req.body;
    try{
        const quizLeaderBoard = await LeaderBoard.findOne({ quizId: quizId })
        if(quizLeaderBoard === null){
            const newLeaderBoard = new LeaderBoard({
                quizId: quizId,
                leaderBoard: leaderBoard
            })
            const data = await newLeaderBoard.save();
            return res.json({
                    success: true,
                    result: "LeaderBoard Successfully Updated"
                })
        }
        const prevData = quizLeaderBoard.leaderBoard.find(item => item.userId.toString() === leaderBoard.userId.toString())
        if(prevData){
            const updatedLeaderBoard = await LeaderBoard.findOneAndUpdate( { quizId: quizId, "leaderBoard.userId": leaderBoard.userId.toString() }, { $set: { "leaderBoard.$.score": leaderBoard.score }  })
        }else{
            const updatedLeaderBoard = await LeaderBoard.findOneAndUpdate( { quizId: quizId }, { $push: { leaderBoard: leaderBoard }  })
        }
        res.json({
            success: true,
            result: "LeaderBoard Successfully Updated"
        })
    }catch(e){
        console.log(e.message);
        res.status(501).json({
            success: false,
            error: e.message,
            result: 'Unable to save data.'
        })
    }
})

module.exports = router