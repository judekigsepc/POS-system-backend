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
    // Use multer middleware for handling the file upload
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading file', error: err });
        }
        if (req.file) {
            return req.file.path
        } else {
            return ''
        }
    });
};

module.exports = {
    timeSetter,
    fileUploader
}