const express = require('express')
const router = express.Router()
const {check,validationResult} = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const secret  = config.get('jwt')
//@route  'end point api/users'
router.post('/',[check('name','Name is required').not().isEmpty(),check('email','Email is required').isEmail(),
check('password','minimum 6 characher length').isLength({min:6})], async(req,res)=>{
    const errors = validationResult(req);
    console.log(req.body)
    if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array( )})
    }


    const {name,email,password} = req.body
    try {
        let user =  User.findOne({email})
        console.log(user)
        // if(user){
        //     return res.status(400).json({errors:[{'msg':'user already exists'}]})
        //   }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        user = new User({
            name,
            email,
            password,
            avatar
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)
        await user.save()
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