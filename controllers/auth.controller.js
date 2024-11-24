const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {fileUploader} = require('../utils/util')

//Function to register user into the system db
const register = async (req,res) => {
    try {
        const {names,password} = req.body

        const existingUser = await User.findOne({names})

        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        req.body.password = hashedPassword

        const imagePath = await fileUploader(req,res)
        req.body.imgUrl = imagePath 

        const result = await User.create(req.body)
        return res.status(200)
            .json({
                message:'User registered successfuly',
                result:result
            })
    }
    catch(err) {
        return res
           .status(500)
           .json({
            error:'Error adding user',
            details: err.message
           })
    }
}

//Function for user login
const login = async (req,res) => {
    try{
        const {names,password} = req.body 

        const NAMES = names.toUpperCase()

        const user = await User.findOne({names : NAMES})
        if(!user) {
            return res.status(400).json({
                error:`User ${NAMES} is not registered`
            })
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({
                error:`Wrong password`
            })
        }
    
        const token = jwt.sign({id :user._id, admin :user.admin },process.env.JWT_SECRET, {expiresIn : process.env.TOKEN_EXP_TIME })
        return res.status(200).json({token})

    }
    catch (err) {
        return res.status(500)
           .json({
            error:'Server error',
            details: err.message
           })
    }
   
}

//Function to enable update of user details
const userUpdate = async (req,res) => {
    try {
        const {password} = req.body
        const {id} = req.params 
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            req.body.password = hashedPassword
        }

        const uptImageUrl = await fileUploader(req,res)
        req.body.imgUrl = uptImageUrl
      
        result = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!result)
            return res
                .status(404)
                .json({ message: `${model.modelName} record not found for update.` });
        res.status(200).json(result)
    }
    catch(err) {
        res.status(500).json({
            error:'Error updating user',
            details: err.message
        })
    }
}

module.exports = {
    register,
    login,
    userUpdate
}