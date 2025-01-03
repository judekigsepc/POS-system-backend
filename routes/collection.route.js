const express = require('express')
const { getAllCollections, getSingleCollection, updateCollection, createCollection, deleteCollection } = require('../controllers/collection.controller')
const router = express.Router()

router.get('/',getAllCollections)
router.get('/:id',  getSingleCollection)
router.put('/:id', updateCollection)
router.post('/', createCollection)
router.delete('/:id', deleteCollection)

module.exports = router