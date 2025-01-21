const Config = require("../models/config.model")
const Business = require('../models/business.model')
const { crudErrorHanlder, resultSender, availChecker } = require("../utils/handlerUtils")
const { fileUploader } = require("../utils/util")
const Transaction = require("../models/transaction.model")
const User = require("../models/user.model")


const changeModelDetails = (model) => async (req,res) => {
    try{
        const modelDoc = await model.find({})
        const {id} = modelDoc[0]
        
        if(model.modelName === 'Business') {
            const imagePath = await fileUploader(req,res)
            req.body.imgURL = imagePath
        }

        const changedDoc = await model.findByIdAndUpdate(id,req.body,{new:true})
        resultSender(`${model.modelName} updated successfuly`,changedDoc,res)

    }catch(err) {
        crudErrorHanlder(`${model.modelName} update error`,err,res)
    }
    
}

const getModelDetails = (model) =>  async (req,res) => {
        try{

            const modelDoc = await model.find({})
            resultSender(`${model.modelName}  results`, modelDoc[0],res)

        }catch(err) {
            crudErrorHanlder(`${model.modelName} record retrieval error`,err,res)
        }
}

const getAllModelRecords = (model) => async (req,res) => {
    try{
        const records = await model.find({})
        resultSender(`${model.modelName} results`,records,res)

    }catch(err) {
        crudErrorHanlder(`${model.modelName} retrieval error`,err ,res)
    }
}

const getSingleRecord = (model) => async (req,res) => {
    try{
        const {id} = req.params
        const record = await model.findById(id)

        availChecker(record,'Record not found in database')

        resultSender(`Result`, record,res)
    }catch(err) {
        crudErrorHanlder(`${model.modelName} retrieval error`,err,res)
    }
}

const queryController = (model) => async(req,res) => {
    try{
       const {key,value} = req.params

       const queryResults = await model.find({[key]: value})

       if(!queryResults || queryResults.length < 1) {
           throw new Error(`${model.modelName} query results not found`)
       }

       resultSender(`${model.modelName} query results`,queryResults,res)
    }
    catch(err) {
        crudErrorHanlder(`${model.modelName} query failed`,err, res)
    }
}

const getConfig = getModelDetails(Config)
const changeConfig = changeModelDetails(Config)

const getBusinessDetails = getModelDetails(Business)
const changeBusinessDetails  = changeModelDetails(Business)

const getAllTransactions = getAllModelRecords(Transaction)
const getSingleTransaction = getSingleRecord(Transaction)

const getAllUsers = getAllModelRecords(User)
const getSingleUser = getSingleRecord(User)

const userQueryController = queryController(User)

const transactionQueryController = queryController(Transaction)


module.exports = {
    getConfig,
    changeConfig,

    getBusinessDetails,
    changeBusinessDetails,

    getAllTransactions,
    getSingleTransaction,

    getAllUsers,
    getSingleUser,

    userQueryController,
    transactionQueryController,
}