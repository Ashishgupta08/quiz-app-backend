const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const router = express.Router()
const { User } = require('../models/model')
const secret = process.env.SECRET;

router.route('/')
    .get(async (req,res)=>{
        const { username, password } = req.body
        try{
            const user = await User.findOne({username: username})
            if(user === null){
                return res.status(404).json({
                    success: false,
                    result: "No user found"
                })
            }
            const validPassword = await bcrypt.compare(password, user.password);
            const token = jwt.sign({ username: user.username }, secret, { expiresIn: '24h' });
            console.log({ token })
            if(validPassword){
                res.json({
                    success: true,
                    result: token
                })
            }else{
                res.status(401).json({
                    success: false,
                    result: "Wrong Password"
                })
            }
        }catch(e){
            res.status(404).json({
                success: false,
                error: e.message,
                result: "No user found"
            })
        }
    })

    .post(async (req,res)=>{
    const {username, password, name, email, contact, gender} = req.body
        try{
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            const newUser = await new User({
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
        }catch(e){
            res.status(409).send({
                success: false,
                error: e.message,
                result: 'User not created'
            })
        }
    })

module.exports = router