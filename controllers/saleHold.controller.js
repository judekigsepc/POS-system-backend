const HeldSale = require("../models/heldSale.model");
const { crudErrorHanlder,resultSender } = require("../utils/handlerUtils");

const holdSale = async (req,res) => {
    try {
        const hold = await HeldSale.create(req.body)
        resultSender('Transaction held successfuly', hold, res)
    }
    catch(err){
        crudErrorHanlder('Error holding transaction',err,res)
    }
}

const getHeldSales = async (req,res) => {
    try {
        const heldTransactions = await HeldSale.find({})
        resultSender('hold results', heldTransactions, res)
    }
    catch(err) {
        crudErrorHanlder('Error retrieving held transactions',err,res)
    }
}

const getSingleHeldSale = async (req,res) => {
    try {
        const {id} = req.params

        const result = await HeldSale.findById(id)

        resultSender('Hold result',result, res)
    }
    catch(err) {
        crudErrorHanlder('Error retrieving held transaction', err,res)
    }
}

module.exports = {
    holdSale,
    getHeldSales,
    getSingleHeldSale
}