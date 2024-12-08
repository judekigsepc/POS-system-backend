require('dotenv').config()
const path = require('path')
const nodemailer = require('nodemailer')
const Joi = require('joi')

const { print } = require('pdf-to-printer')
const { messageHandler, successMessageHandler, errorHandler } = require('../utils/util')
const { validateIfEmail, validateIfNumber, validateIfString } = require('../utils/validationUtils')

const printInvoice = async (socket, invoiceName) => {
    try{
        validateIfString(invoiceName,'Print Error: Invoice name not present or Invalid(Should be string)')
    }
    catch(err) {
        return errorHandler(socket, err.message)
    }

    try {
        const pdfPath = path.join(__dirname,`../public/documents/${invoiceName}.pdf`)
        messageHandler(socket, 'task', 'Printing pdf')
        await print(pdfPath)
        successMessageHandler(socket, 'Invoice printed successfuly')
    }
    catch(err) {
        errorHandler(socket, `Printing Error: ${err}`)
    }
}


const emailInvoice = async (socket,invoiceName,reEmail) => {
    try{
        validateIfEmail(reEmail,'Email Error: Email Address Invalid or missing')
        validateIfString(invoiceName,'Email error: Invoice name not present or Invalid(Should be string)')
    }
    catch(err) {
        return errorHandler(socket,err.message )
    }
   
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:'kiggundujude120@gmail.com',
            pass: process.env.GOOGLE_PASSKEY
        }
    })

    const mailOptions = {
        from:'kiggundujude120@gmail.com',
        to: reEmail,
        subject:'INVOICE',
        text:'JK TECH SOLUTIONS PURCHASE INVOICE',
        attachments: [
           {
             filename:`${invoiceName}.pdf`,
             path: path.join(__dirname, `../public/documents/${invoiceName}.pdf`)
           }
        ]
    }

    try {
    messageHandler(socket,'task',`sending email to ${reEmail}`)
     const info = await transporter.sendMail(mailOptions)
     successMessageHandler(socket, `Email sent: ${info.response}`)
    }
    catch(err) {
     errorHandler(socket, `Email error: ${err}`)
    }
}

module.exports = {
    printInvoice,
    emailInvoice
}