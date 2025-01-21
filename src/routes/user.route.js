const express = require('express')
const { getAllUsers, getSingleUser, userQueryController } = require('../controllers/defs.controller')
const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getSingleUser)
router.get('/:key/:value', userQueryController)

module.exports = router