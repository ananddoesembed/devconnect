const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const Profile = require('../models/Profile')
const {check,validationResult} = require('express-validator')
const User = require('../models/User')
const request = require('request')
const config = require('config')
//@route  'end point api/profile'
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
router.get('/',async(req,res)=>{
    try {
        const profile = await Profile.find().populate('user',['name','avatar'])
        
        if(!profile){
            return  res.status(400).send('no profile')
        }
        res.json(profile)
    } catch (error) {
        res.status(401).send({msg:'profile not found'})
    }
    })

    router.get('/user/:user_id',async(req,res)=>{
        try {
            const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
            
            if(!profile){
                return  res.status(400).send('no profile')
            }
            res.json(profile)
        } catch (error) {
            res.status(401).send({msg:'profile not found'})
        }
        })
router.delete('/',auth,async(req,res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id})
        await User.findOneAndRemove({_id:req.user.id})
        res.json("deleted")
    } catch (error) {
        res.status(401).send({msg:'profile not found'})
    }
    })
router.put('/experience',auth,([check('title','Title is required').not().isEmpty(),check('company','Company is required').not().isEmpty(),check('from','From date is required').not().isEmpty()]),async(req,res)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array( )})
    }
    const {title,company,from } = req.body
    const newExp = {
        title,company,from
    }
    try {
      const profile = await Profile.findOne({user:req.user.id});  
      console.log(profile)
      profile.experience.unshift(newExp);
      await profile.save()
      res.send('saved')
    } catch (error) {
     return  res.send('server error')
    }
})

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id})
        removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex,1)
        console.log(removeIndex,profile.experience)
        await profile.save()
        res.send('deleted')
    } catch (error) {
        res.status(404).send('experience not found')
    }
})
router.put('/educations',auth,([check('degree','degree is required').not().isEmpty()]),async(req,res)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array( )})
    }
    const {degree } = req.body
    const newEdu = {
        degree
    }
    try {
      const profile = await Profile.findOne({user:req.user.id});  
      console.log(profile)
      profile.education.unshift(newEdu);
      await profile.save()
      res.send('saved')
    } catch (error) {
     return  res.send('server error')
    }
})

router.delete('/educations/:edu_id',auth,async(req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id})
        removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex,1)
        console.log(removeIndex,profile.education)
        await profile.save()
        res.send('deleted')
    } catch (error) {
        res.status(404).send('education not found')
    }
})
router.get('/github/:user_name',(req,res)=>{
    try {
        const options={
            uri:`https://api.github.com/users/${req.params.user_name}/repos?per_page=5&sort=created:asc&client_id
            =${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{'user-agent':'nodejs'}
        }
        request(options,(error,response,body)=>{
            console.log(error)
            if(response.statusCode!==200){
                // res.status(404).json({msg:'no profile'})
                console.log(response)
            }
            res.json(JSON.parse(body))
        })
    } catch (error) {
        res.status(400).send('not found')
    }
})
module.exports = router ;