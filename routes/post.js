const express = require('express')
const router = express.Router()

//@route  'end point api/users'
router.get('/',(req,res)=>{
    res.send('api post')
})

module.exports = router ;