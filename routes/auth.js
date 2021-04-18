const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {check,validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const secret = config.get('jwt')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
//@route  'end point api/auth'
router.get('/',auth,async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(501).json('Server Error')
    }
})

//validate user

router.post('/',[check('email','Email is required').isEmail(),
check('password').exists()], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array( )})
    }


    const {email,password} = req.body
    try {
        let user = await User.findOne({email},function(err,result){
            console.log(err)
        })
        console.log(user)
        if(!user){
            return res.status(400).json({errors:[{'msg':'invalid credentials'}]})
          }
        const isMatch = await bcrypt.compare(password,user.password)
        console.log(isMatch)
        if(!isMatch){
          return res.status(400).json({errors:[{'msg':'invalid credentials'}]})
        }
        const payload = {
            user:{
                id:user.id    //id intead _id mongoose use abstraction
            }
        }
        jwt.sign(payload,secret,{expiresIn:3600},(err,token)=>{
            if(err){
                throw err
            }
            res.json({token})
        })
    } catch (error) {
        
        console.log(error)
        res.status(500).send('server error')
    }
    
})

module.exports = router ;