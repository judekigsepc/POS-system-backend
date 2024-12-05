const axios = require('axios')
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')

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
         cb(null,path.join(__dirname,'../public/images'))
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
                return resolve(`public/images/${req.file.filename}`)
            }else {
                return resolve('')
            }
        }) 
    })
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authtoken"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.sendStatus(401); // No token
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user;
      next();
    });
  };

const adminOnly = (req,res,next) => {
    if(req.user.admin !== true) {
        return res.status(403)
                   .json({
                    error:'Access Denied! Your not an admin'
                   })
    }
    next()
}


//Error emitter
const errorHandler =  (socket,err) => {
    return socket.emit('error',err)
}
  
module.exports = {
    timeSetter,
    fileUploader,
    authenticateToken,
    adminOnly,
    errorHandler
}