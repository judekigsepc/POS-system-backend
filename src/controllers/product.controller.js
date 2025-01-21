const Product = require("../models/product.model")
const { resultSender, crudErrorHanlder, availChecker, deleteFile } = require("../utils/handlerUtils")
const { fileUploader, successMessageHandler } = require("../utils/util")



//Function to retrieve all products from the database
const getAllProducts = async (req,res) => {
    try{
        const products = await Product.find({})

        resultSender('Products retrieved successfuly', products,res)
    }catch(err) {

         crudErrorHanlder('Retrieving products failed',err,res)
    }
}

//Function to retrieve a single product from the database
const getSingleProduct = async (req,res) => {
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        availChecker(product,'Product not found')
        resultSender('Product retrieved successfuly', product,res)
    }
    catch(err) {
        crudErrorHanlder('Retrieving product failed:',err,res)
    }   
}

//Function to add a  product to the database
const createProduct = async (req,res) => {
    try {
        const imagePath = await fileUploader(req,res)
        req.body.imgUrl = imagePath

        const savedProduct = await Product.create(req.body)

        resultSender('Product added successfuly', savedProduct,res)
    }catch(err){
        return crudErrorHanlder('Product addition falied',err,res)
    }

}

//Function to handle bulk product addition via csv or json files - Handles without images 
const bulkProductAdd = async (req,res) => {

}

//Function to delete a product from the database
const deleteProduct = async (req,res) => {
     try{
          const {id} = req.params
          const result = await Product.findByIdAndDelete(id)
        
          availChecker(result,'Product not found for deletion')
          
          resultSender('Product deleted successfuly', result,res)
     }
     catch(err) {
       return crudErrorHanlder('Product deletion failed',err,res)
     }
}

//Function to update a product in the database
const updateProduct = async (req,res) => {
       try {
          const {id} = req.params

          //Get image path from fileUploader
          const imgPath = await fileUploader(req,res)

          //Image path validation to check if its really available to prevent damage to the current imgUrl
          if(imgPath) {
            req.body.imgUrl = imgPath
          }
         
          const productToUpdate = await Product.findById(id)
          if(!productToUpdate) {
            deleteFile(imgPath)

            res.status(400).json({
                error:'Update Error',
                details:'Product not found for deletion'
            })
          }
          deleteFile(productToUpdate.imgUrl)

          
          const result = await Product.findByIdAndUpdate(id, req.body, {new:true})
          availChecker(result, 'Product not found for update')

          resultSender('Product updated successfuly', result,res)
       }
       catch(err){

         return crudErrorHanlder('Product update failed',err,res)
       }
}



module.exports = {
    createProduct,
    bulkProductAdd,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct
}