const Category = require('../models/category.model')
const { crudErrorHanlder, availChecker, resultSender } = require('../utils/handlerUtils')

const getAllCollections = async (req,res) => {
    try{
         const categories = await Category.find({})
         resultSender('Categories retrieved successfuly',categories,res)
    }catch(err) {
         crudErrorHanlder('Retrieving categories failed',err,res)
    }
}

//Function to retrieve a single product from the database
const getSingleCollection = async (req,res) => {
    try{
        const {id} = req.params
        const category = await Category.findById(id)

        availChecker(category,'Category not found')

        resultSender('Requested category retrieved successfuly',category,res)
    }
    catch(err) {
        crudErrorHanlder('Retrieving category failed:',err,res)
    }   
}

//Function to add a  product to the database
const createCollection = async (req,res) => {
    try {
        const savedCategory = await Category.create(req.body)

        res.status(200).json({
            message:'Category created successfuly',
            category: savedCategory
        }) 
    }catch(err){
        return crudErrorHanlder('Product addition falied',err,res)
    }

}

//Function to delete a product from the database
const deleteCollection = async (req,res) => {
     try{
          const {id} = req.params
          const result = await Category.findByIdAndDelete(id)
        
          availChecker(result,'Category not available for deletion')

          res.status(200).json({
            message:'Category deleted successfuly'
          })

     }
     catch(err) {
       return crudErrorHanlder('Category deletion failed',err,res)
     }
}

//Function to update a product in the database
const updateCollection = async (req,res) => {
       try {
          const {id} = req.params
          
          const result = await Category.findByIdAndUpdate(id, req.body, {new:true})
          availChecker(result, 'Category not found for update')

          res.status(200).json({
            message:'Category Updated successfuly',
            product:result
          })
       }
       catch(err){
         return crudErrorHanlder('Category update failed',err,res)
       }
}

module.exports = {
    createCollection,
    deleteCollection,
    updateCollection,
    getAllCollections,
    getSingleCollection
}
