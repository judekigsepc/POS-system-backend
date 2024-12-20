const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {fileUploader} = require('../utils/util')
const {deleteFile} = require('../utils/handlerUtils')
const fs = require('fs')

//Function to register user into the system db
const register = async (req,res) => {
    try {
        const imagePath = await fileUploader(req,res)
        req.body.imgUrl = imagePath 

        const {names,password} = req.body
        console.log(req.body)

        const existingUser = await User.findOne({names:names.toUpperCase()})
        console.log(existingUser)

        if(existingUser){
            deleteFile(imagePath)
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        req.body.password = hashedPassword

       
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
        
        const uptImageUrl = await fileUploader(req,res)
        req.body.imgUrl = uptImageUrl

        const {password} = req.body
        const {id} = req.params 

        const userToUpdate = await User.findById(id)
        if(!userToUpdate) {
            res.status(400).json({
               error: 'User update failed',
               details:'User not found in database'
            })
            deleteFile(uptImageUrl)
        }

        deleteFile(userToUpdate.imgUrl)
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            req.body.password = hashedPassword
        }
      
        result = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!result)
            return res
                .status(404)
                .json({ message: `User not found for update.` });
        res.status(200).json(result)
    }
    catch(err) {
        res.status(500).json({
            error:'Error updating user',
            details: err.message
        })
    }
}

const deleteUser = async (req,res) => {
    try{
        const {id} = req.params
        const deletedUser = await User.findByIdAndDelete(id)
    
        if(!deletedUser) {
            throw new Error('User not found in database')
        }
        
        deleteFile(deletedUser.imgUrl)

        res.status(200).json({
            message:'User deleted successfuly',
            result:deletedUser
        })
    }
    catch(err) {
        return res.status(500)
                   .json({
                    error:err,
                    details: err.message
                   })
    }
}

//USER DELETION LOGIC SHOULD BE HERE

module.exports = {
    register,
    login,
    userUpdate,
    deleteUser
}
