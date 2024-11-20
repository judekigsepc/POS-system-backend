require('dotenv').config()

const {adminOnly,authenticateToken} = require('./utils/util')

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const addRouter = require('./routes/add.route')
const getRouter = require('./routes/get.route')
const deleteRouter = require('./routes/delete.route')
const updateRouter = require('./routes/update.route')
const authRouter = require('./routes/auth.route')

const app = express()
const dbURI = process.env.dbURL

const port = process.env.PORT
app.listen(port, () => console.log(`POS server running on port ${port}`))
 
const dbConnect = async () =>  {
    try{
        await mongoose.connect(dbURI)
        console.log('Connected to database successfuly')
    }
    catch(err){
         console.log(err) 
    }
}
dbConnect()

app.get('/testauth', authenticateToken, adminOnly ,(req,res) => {
    res.send('Conn success')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/images', express.static(path.join(__dirname,'images')))

app.get('/',(req,res) => {
    res.send('POS SERVER IS UP AND RUNNING')
})

app.use('/api/add',addRouter)
app.use('/api/get',getRouter)
app.use('/api/delete',deleteRouter)
app.use('/api/update',updateRouter)
app.use('/api/auth',authRouter)

