const axios = require('axios')
const multer = require('multer')
const path = require('path')

const timeSetter = async() => {
    try{
        const response = await  axios.get('https://timeapi.io/api/time/current/zone?timeZone=Africa%2FKampala')
        return response.data.dateTime
    }catch (err){
         return Date.now
    }
}

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
         cb(null,path.join(__dirname,'../images'))
    },
    filename: function (req,file,cb) {
        cb(null,Date.now() + '-' + file.originalname )
    }
})

const upload = multer({storage: storage})

const fileUploader = (req, res) => {
    return new Promise((resolve,reject) => {
        upload.single('image') (req,res,(err) => {
            if(err) {
                return reject({message:`Error uploading file: ${err}`})
            }
            if(req.file) {
                return resolve(req.file.path)
            }else {
                return resolve('')
            }
        }) 
    })
};

module.exports = {
    timeSetter,
    fileUploader
}