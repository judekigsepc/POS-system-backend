const Product = require("../models/product.model")
const { errorHandler } = require("../utils/util")

const calculateCollection = async (socket,data) => {
  if(!data) {
    errorHandler(socket, 'Collection calculation data not provided')
  }

  const {productsData,discountData} = data

  console.log(productsData)
  if (!productsData || productsData.length < 1) {
   console.log('collection is empty')
    // errorHandler(socket, 'No products data provided')
    return socket.emit('collection-calc-result',0)
  }

  const productPromises = productsData.map(async (product) => {
   const wantedProduct = await Product.findById(product._id)
   if(!wantedProduct) {
        errorHandler(socket, 'Product Not found in database')
   }

   const {name, price,taxes,discount,discountType,inStock} = wantedProduct

   if(inStock <= 0) {
      return errorHandler(socket, `${name} is OUT OF STOCK - If you think this is wrong please contact system admin`)
   }
   let goneDiscount
   if(discountType === 'percent') {
      goneDiscount = discount /100 * price
   }else if(discountType === 'flat') {
      goneDiscount = discount
   }else {
      errorHandler(socket,'Invalid discount type detected on product. Not accounted for')
      goneDiscount = 0
   }
   
   return (Number(price) + taxes) - goneDiscount
  })

  const productSubTotals = await Promise.all(productPromises)

  let total = productSubTotals.reduce((acc,subTotal) => acc + subTotal,0)  
 
  if(discountData.discountType === 'percent') {
    total = total - (discountData.discount / 100 * total)
  }else if(discountData.discountType === 'flat') {
    total = total - discountData.discount
  }else {
   errorHandler(socket,'Invalid discount type detected on Collection. Not accounted for')
   total = total
  }

  console.log(total)
  socket.emit('collection-calc-result',total)
}

module.exports = {calculateCollection}