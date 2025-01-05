const Collection = require('../models/collection.model')
const { crudErrorHanlder, availChecker, resultSender } = require('../utils/handlerUtils')

const getAllCollections = async (req,res) => {
    try{
         const collections = await Collection.find({})
         resultSender('Collections retrieved successfuly',collections,res)
    }catch(err) {
         crudErrorHanlder('Retrieving categories failed',err,res)
    }
}

//Function to retrieve a single product from the database
const getSingleCollection = async (req,res) => {
    try{
        const {id} = req.params
        const collection = await Collection.findById(id)

        availChecker(collection,'Collection not found')

        resultSender('Requested Collection retrieved successfuly',collection,res)
    }
    catch(err) {
        crudErrorHanlder('Retrieving Collection failed:',err,res)
    }   
}

//Function to add a  product to the database
const createCollection = async (req,res) => {
    try {
        const savedCollection = await Collection.create(req.body)

        res.status(200).json({
            message:'Collection created successfuly',
            Collection: savedCollection
        }) 
    }catch(err){
        return crudErrorHanlder('Collection creation failed',err,res)
    }

}

//Function to delete a product from the database
const deleteCollection = async (req,res) => {
     try{
          const {id} = req.params
          const result = await Collection.findByIdAndDelete(id)
        
          availChecker(result,'Collection not available for deletion')

          res.status(200).json({
            message:'Collection deleted successfuly'
          })

     }
     catch(err) {
       return crudErrorHanlder('Collection deletion failed',err,res)
     }
}

//Function to update a product in the database
const updateCollection = async (req,res) => {
       try {
          const {id} = req.params
          
          const result = await Collection.findByIdAndUpdate(id, req.body, {new:true})
          availChecker(result, 'Collection not found for update')

          res.status(200).json({
            message:'Collection Updated successfuly',
            product:result
          })
       }
       catch(err){
         return crudErrorHanlder('Collection update failed',err,res)
       }
}

module.exports = {
    createCollection,
    deleteCollection,
    updateCollection,
    getAllCollections,
    getSingleCollection
}
