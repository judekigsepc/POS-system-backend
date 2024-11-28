import axios from 'axios'
import io from 'socket.io-client'

//ACCEPTABLE ITEMS NAMES ARE ONLY:
//post,comment,user,author
//These parameters should be in singular

const apiUrl = 'http://localhost:3000'
const validItems = ['user','product','transaction']

const socket = io('http://localhost:3000')

//Function to retreive all records
const getAll = async (itemName) => {
    if(validItems.includes(itemName)) {
        try {
            const response = await  axios.get(`${apiUrl}/api/get/all-${itemName}s`)
            return response.data
            }
            catch (err) {
              handleError(err)
            }
    }else {
        console.error('Invalid parameter')
    }
    
}

//Function to retrieve single record for whatever reason
const getSingle = async (itemName,id) => {
    if (validItems.includes(itemName)){
        try {
            const response = await axios.get(`${apiUrl}/api/get/${itemName}/${id}`)
            return response.data
            }
            catch(err) {
               handleError(err)
            }
    }else {
        console.error('Invalid parameter')
    }
}

//CRUD PRODUCT ADD FUNCTION
const addProduct = async (data) => {
    if(validItems.includes(itemName)) {
        try {
            const response = await axios.post(`${apiUrl}/api/add/product`, data);
            return response.data;
        } catch (err) {
           handleError(err)
        }
    }
    else{ 
        console.error('Invalid paramter')
    }
   
}

//CRUD UPDATE FUNCTION
const updateItem = async (itemName,id,data) => {
    if(validItems.includes(itemName)) {
        try {
            const response = await axios.put(`${apiUrl}/blog/update/${itemName}/${id}`,data)
            return response.data
         }
         catch(err) {
           handleError(err)
   }
    }
    else{
        console.error('Invalid paramter')
    }
     
}

//CRUD DELETE FUNCTION
const deleteItem = async (itemName,id) => {
    if(validItems.includes(itemName)) {
        try {
            const response = await axios.delete(`${apiUrl}/blog/delete/${itemName}/${id}`)
            return response.data
      }
      catch (err) {
           handleError(err)
      }
    }
    else{
        console.error('Invalid paramter')
    }
  
}

//Error receiver
socket.off('error')
socket.on('error',(data) => {
     console.error(data)
})

//Notification handler
socket.off('notification')
socket.on('notification', (data) => {
    console.log(data)
})

//Function to add to the cart
const addToCart = (prodId,qty) => {
    socket.emit('add_to_cart', {prodId, qty})
}

//Function to update the cart
const updateCart = (prodIndex, qty) => {
  socket.emit('update_qty',{prodIndex, qty})
}

//Function to delete from cart
const deleteInCart = (prodIndex) => {
    socket.emit('delete_from_cart',prodIndex)
}

const discountCart = (discount,type) => {
    socket.emit('discount_cart',{discount,type})
}

//Function that handles results and changes in the cart
const handleCartResult = (callback) => {
    socket.off('result')
    socket.off('upt_result')
    socket.off('delete_command')
    socket.off('discount_result')
    
    let cart = {
      cartProducts : [],
      cartTotal : 0,
      cartGeneralDiscount:0,
    }
    //addition result handler
    socket.on('result', (data) => { 
      cart.cartProducts.push(data.product)
      cart.cartTotal = data.cartTotal
      
      callback(cart)
    })
     
    //Update result handler
    socket.on('upt_result',(data) => {
        const {prodIndex, productToUpdate,cartTotal} = data
        cart.cartProducts[prodIndex] = productToUpdate
        cart.cartTotal = cartTotal

        callback(cart)
    })

    //The Great Deleter 😅 Deletion command to your cart array
    socket.on('delete_command', (data) => {
        const {cartTotal, prodIndex} = data
        cart.cartProducts.splice(prodIndex, 1)
        cart.cartTotal = cartTotal

        callback(cart)
    })

    //Discounting result handler
    socket.on('discount_result', (data) => {
        const {cartGeneralDiscount, cartTotal} = data

        cart.cartGeneralDiscount = cartGeneralDiscount
        cart.cartTotal = cartTotal

        callback(cart)
    })
}

//Function that handles CRUD operation errors
const handleError = (err) => {
    if(err.response) {
        console.error(`Error :${err.response.status}`)
        console.error(`Error : ${err.response.data}`)
     }
     else if (err.request) {
        console.error('Error: No response was received from server')
        console.error('Request Data', err.request)
     }
     else{
        console.error('Error in setting up request:', err.message)
     }
}

export {addProduct, getAll, getSingle, updateItem, deleteItem, addToCart, updateCart ,handleCartResult, deleteInCart,discountCart}