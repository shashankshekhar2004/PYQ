const fs = require('fs');
const pdfModel = require('../models/pdf');

const filePath = '/path/to/your/pdf/file.pdf';
const pdfName = 'file.pdf';
const pdfData = fs.readFileSync(filePath);
const pdfContentType = 'application/pdf';

const pdfDoc = new pdfModel({
  name: pdfName,
  data: pdfData,
  contentType: pdfContentType
});

pdfDoc.save((error, pdf) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log('PDF saved successfully!');
  }
});