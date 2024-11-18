const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const addRouter = require('./routes/add.route')
const getRouter = require('./routes/get.route')
const deleteRouter = require('./routes/delete.route')
const updateRouter = require('./routes/update.route')
const specialRouter = require('./routes/special.router')

const app = express()
const dbURI = 'mongodb+srv://Jude:sknj.inc@poscluster.lmglv.mongodb.net/?retryWrites=true&w=majority&appName=posCluster'

const port = 3000
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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res) => {
    res.send('POS SERVER IS UP AND RUNNING')
})

app.use('/api/add',addRouter)
app.use('/api/get',getRouter)
app.use('/api/delete',deleteRouter)
app.use('/api/update',updateRouter)
app.get('/api/special',specialRouter)

