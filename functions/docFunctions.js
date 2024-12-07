const fs = require('fs')
const path = require('path')

const Handlebars = require('handlebars')
const puppeteer = require('puppeteer')

const Business = require('../models/business.model')
const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')

const {errorHandler, successMessageHandler} = require('../utils/util')

const generateInvoice = async (socket, savedTransaction) => {
         fillInvoiceTemplate(socket,savedTransaction)
}

Handlebars.registerHelper('eq', function (arg1, arg2) {
    return arg1 === arg2;
  });

//Function that fills the invoice template
const fillInvoiceTemplate = async (socket,savedTransaction) => {
    try{
        const {_id,items,transDate,executor,totalCostPrice,generalDiscount,payedAmount,change,paymentMethod} = savedTransaction
        const business = await Business.find({})

         const {names} = await User.findById(executor)
       
        
        const {businessName,currency, VATNumber, address,contactInfo} = business[0]
        const itemList = items.map(item => ({
            ...item._doc
        }))

        const data = {
            businessName,
            transactionId: _id,
            userName: names,
            transDate:transDate,
            items:itemList,
            generalDiscount:generalDiscount,
            payedAmount:payedAmount,
            grandTotal:totalCostPrice,
            change:change, 
            curr: currency,
        }
    
        const templatePath = path.join(__dirname,'./docs/invoice.html')
        const templateSource = fs.readFileSync(templatePath, 'utf-8')

        const template = Handlebars.compile(templateSource)

        const renderedHTML = template(data)
        
        generateInvoicePDF(socket,renderedHTML,_id)
    }
    catch(err) {
         errorHandler(socket,`Invoice Error: ${err}`)
    }
}

//Function that generates the pdf for the invoice
const generateInvoicePDF = async (socket,renderedHTML,transactionId) => {
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(renderedHTML)
        const invoiceName = invoiceNameGenerator(transactionId)

        const pdfPath = path.join(__dirname, `../public/documents/${invoiceName}.pdf`)

        await page.pdf({
            path: pdfPath,
            format:'A4',
            printBackground: true
        })

        await browser.close()

        attachInvoiceToTransaction(socket,invoiceName,transactionId)
        successMessageHandler(socket,`Invoice PDF generated and saved successfuly`)
    }
    catch(err) {
        errorHandler(socket, `Invoice Error: ${err}`)
    }

}

//Function that saves the invoice path to invoiceURL of the transaction
const attachInvoiceToTransaction = async (socket, invoiceName,transactionId) => {
     try{
        await Transaction.findByIdAndUpdate(transactionId, {invoiceUrl: `public/documents/${invoiceName}.pdf`},{new: true})
     }  
     catch(err) {
         errorHandler(socket, `Invoice attachment Error: ${err}`)
     }  
}

//Function that generates the invoice name string
const invoiceNameGenerator = (transactionId) => {
    const date = Date.now()
    return `invoice-${transactionId}-${date}`
} 

module.exports = {
    generateInvoice
}