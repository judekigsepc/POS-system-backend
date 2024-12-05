const fs = require('fs')
const Handlebars = require('handlebars')
const path = require('path')
const puppeteer = require('puppeteer')
const { error } = require('console')

const Product = require('../models/product.model')
const Business = require('../models/business.model')
const User = require('../models/user.model')

Handlebars.create().compileOptions = {
    allowProtoPropertiesByDefault: true,
};

const generateInvoice = async (savedTransaction) => {
    const {_id,items,transDate,executor,totalCostPrice,generalDiscount,payedAmount,change,paymentMethod} = savedTransaction
    const {business} = await Business.find({})
    const {names} = await User.findById(executor)

   const itemList = items.map(item => ({
   ...item._doc, // Extract the actual data
   itemId: item._doc.itemId.toString(), // Convert ObjectId to string
  _id: item._doc._id.toString()       // Convert _id to string
}));


    const data = {
        businessName: business,
        transactionId: _id,
        userName: names,
        transDate:transDate,
        items:itemList,
        generalDiscount:generalDiscount,
        payedAmount:payedAmount,
        grandTotal:totalCostPrice,
        change:change, 
        curr:'UGX '
    }

    const templatePath = path.join(__dirname, './docs/invoice.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile the template
    const template = Handlebars.compile(templateSource, {
        allowProtoPropertiesByDefault: true,
    });
    
    // Inject the data
    const renderedHtml = template(data);
    
    pdfGen(renderedHtml)
}

const pdfGen = async (renderedHtml) => {
    try{
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setContent(renderedHtml);
        const invoicename = await randomInvoiceNameGenerator()
    
        const pdfPath = path.join(__dirname,`../public/documents/${invoicename}`)
    
        await page.pdf({
            path: pdfPath,  // Path to save the generated PDF
            format: 'A4',   // Paper size
            printBackground: true  // Include background in the PDF
          });
      
          await browser.close();
          console.log(`PDF generated and saved to ${pdfPath}`);

    }catch(err) {
        console.log(`PDF GENERATION FAILED ${err}`)
    }
}

const randomInvoiceNameGenerator = async () => {
    try {
        const date = Date.now()
        const filename = `invoice-${date}.pdf`
        return filename
    }catch(err) {
        console.log(error)
    }
   
}

module.exports = {
    generateInvoice
}

