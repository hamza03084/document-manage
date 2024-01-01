const fs = require("fs")
const { rgb, PDFDocument } = require("pdf-lib")
const { uploadFileToS3 } = require("../helper/s3-upload")
// const { generateRandomNumber } = require("./randomNumber")

exports.generateFile = async (ppmCode) => {
  const pdfFile = fs.readFileSync(`${process.cwd()}/src/pdf/shakir-uet.pdf`)
  const pdfDoc = await PDFDocument.load(pdfFile)
//   const ppmCode = generateRandomNumber()
  const watermarkText = `${ppmCode}`
  const pages = pdfDoc.getPages()

  for (const page of pages) {
    const { width } = page.getSize()
    const fontSize = 30

    const textWidth = fontSize * watermarkText.length

    const x = width - textWidth - 10
    const y = 30
    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      color: rgb(0, 0, 0),
    })
  }

  const modifiedPdfBytes = await pdfDoc.save()
  const downloadsFolderPath = `${process.cwd()}/downloads`;
  if (!fs.existsSync(downloadsFolderPath)) {
    fs.mkdirSync(downloadsFolderPath);
  }
  const fileURL = await uploadFileToS3(modifiedPdfBytes, `${ppmCode}.pdf`)
  
  return fileURL;
}