const express = require('express')
const router = express.Router()

//@route  'end point api/auth'
router.get('/',(req,res)=>{
    res.send('api')
})

module.exports = router ;