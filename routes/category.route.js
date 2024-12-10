const express = require('express')
const { getAllCategories, getSingleCategory, updateCategory, createCategory, deleteCategory } = require('../controllers/category.controller')
const router = express.Router()

router.get('/',getAllCategories)
router.get('/:id',  getSingleCategory)
router.put('/:id', updateCategory)
router.post('/', createCategory)
router.delete('/:id', deleteCategory)

module.exports = router