const jwt = require('jsonwebtoken')
const config = require('config')
const jwtToken = config.get('jwt')

module.exports = function(req,res,next){
const token = req.header('x-auth-token');
if(!token){
    return res.status(401).json({msg:'no token'})
}
try {
    const decoded = jwt.verify(token,jwtToken)
    req.user = decoded.user
    next()
} catch (error) {
    res.status(401).json({msg:'no token'})
    console.log(error)
}
}