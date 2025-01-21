const express = require('express')
const { changeConfig, getConfig } = require('../controllers/defs.controller')
const router = express.Router()

router.get('/',getConfig)
router.put('/',changeConfig)

module.exports = router