const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { print } = require('pdf-to-printer');

// Function to create a PDF invoice
function createPDF() {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, '../public/documents/invoice.pdf');
  
  doc.pipe(fs.createWriteStream(pdfPath));

  // Add some content to the PDF
  doc.fontSize(25).text('Invoice', { align: 'center' });
  doc.fontSize(15).text('Product: Example Product', 100, 100);
  doc.text('Quantity: 2', 100, 130);
  doc.text('Total: $20.00', 100, 160);

  doc.end();

  printPDF(pdfPath)
}

// Function to print the generated PDF
function printPDF(pdfPath) {
  print(pdfPath)
    .then(() => {
      console.log('Printing complete!');
    })
    .catch((err) => {
      console.error('Error printing PDF:', err);
    });
}

// Main function to create and print the invoice
function generateAndPrintInvoice() {
  const pdfPath = createPDF();
  console.log('PDF created at:', pdfPath);
  
  // Now send the PDF to the printer
  printPDF(pdfPath);
}

// Run the function to create and print the PDF
generateAndPrintInvoice();
