const express = require('express')
const router = express.Router()
const {check,validationResult} = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
//@route  'end point api/users'
router.post('/',[check('name','Name is required').not().isEmpty(),check('email','Email is required').isEmail(),
check('password','minimum 6 characher length').isLength({min:6})], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array( )})
    }
    console.log(req.body)
    const {name,email,passowrd} = req.body
    try {
        let user =  User.findOne({name})
        if(user){
            res.status(400).json({errors:[{'msg':'user already exists'}]})
        }
    } catch (error) {
        
        console.log(error)
        res.status(500).send('server error')
    }
    
})

module.exports = router ;