const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const Profile = require('../models/Profile')
const {check,validationResult} = require('express-validator')
//@route  'end point api/profile'
router.get('/',(req,res)=>{
    res.send('api profile')
})
router.get('/me',auth,async(req,res)=>{
try {
    const profile = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
    if(!profile){
      return  res.status(400).send('no profile')
    }
    res.json(profile)
} catch (error) {
    res.status(401).send({msg:'profile not found'})
}
})

router.post('/',[auth,[check('status','status is required').not().isEmpty()]],async(req,res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array( )})
    }
    
    const profileFields={}
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    console.log(profileFields.skills)
    try {
        let profile = await Profile.findOne({user:req.user.id})
        if(profile){
            profile =await Profile.findOneAndUpdate({user:req.user.id},
                {$set:profileFields},
                {new:true})
                return res.json(profile)
            }
            profile = new Profile(profileFields)
            console.log(profile)
        await profile.save((err,pdt)=>{
            console.log(err)
        })
        res.json(profile)
    } catch (error) {
        res.status(401).send({msg:'profile not found'})
    }
})
module.exports = router ;