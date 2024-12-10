const express = require('express')
const router = express.Router()

const {register,login,userUpdate,deleteUser} = require('../controllers/auth.controller')
const {authenticateToken, adminOnly} = require('../utils/util')


router.post('/register',register)
router.post('/login',login)
router.put('/update/:id',[authenticateToken, adminOnly],userUpdate)
router.delete('/delete/:id',deleteUser)

module.exports = router