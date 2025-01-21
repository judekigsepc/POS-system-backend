const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer()

const {register,login,userUpdate,deleteUser} = require('../controllers/auth.controller')
const {authenticateToken, adminOnly} = require('../utils/util')


router.post('/register', register)
router.post('/login', login)
router.put('/update/:id',userUpdate)
router.delete('/delete/:id', deleteUser)

module.exports = router