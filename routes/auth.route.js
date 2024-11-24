const express = require('express')
const router = express.Router()

const {register,login,userUpdate} = require('../controllers/auth.controller')
const {authenticateToken, adminOnly} = require('../utils/util')


router.post('/register',register)
router.post('/login',login)
router.post('/user-update/:id',[authenticateToken, adminOnly],userUpdate)

module.exports = router