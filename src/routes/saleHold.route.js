const express = require ('express')
const { getHeldSales,getSingleHeldSale,holdSale} = require('../controllers/saleHold.controller')
const router = express.Router()


router.get('/', getHeldSales)
router.get('/:id' ,getSingleHeldSale)
router.post('/', holdSale)

module.exports = router