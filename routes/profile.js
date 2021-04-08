const express = require('express')
const router = express.Router()

//@route  'end point api/profile'
router.get('/',(req,res)=>{
    res.send('api profile')
})

module.exports = router ;