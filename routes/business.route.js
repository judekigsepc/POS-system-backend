const express = require('express')
const { changeBusinessDetails, getBusinessDetails } = require('../controllers/defs.controller')
const router = express.Router()

router.get('/', getBusinessDetails)
router.put('/', changeBusinessDetails)

module.exports = router