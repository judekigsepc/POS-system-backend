const fs = require('fs')

//ERROR HANDLER FOR CRUD OPERATIONS
const crudErrorHanlder = (msg,err,res) => {
    return res.status(500).json({
        error:msg,
        details: err.message
    })
}

//AVAILABILITY CHECKER FOR CRUD OPERATIONS
const availChecker = (item,msg) => {
    if(!item) {
      throw new Error(msg)
    }
}

//RESULT SENDERS
const resultSender = (message,result,res) => {
    res.status(200).json({
        message:message,
        result: result,
    })
}


const deleteFile =  (filePath) => {
    fs.unlink(filePath, (err) => {
        if(err) {
            console.log(err)
        }else{
            console.log('File deleted successfuly')
        }
    })
}

module.exports = {
    crudErrorHanlder,
    availChecker,
    resultSender,
    deleteFile
}