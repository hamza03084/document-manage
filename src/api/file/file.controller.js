const catchAsync = require("../../utils/catchAsync")
const fs = require("fs")
const { rgb, PDFDocument } = require("pdf-lib")
const { generateRandomNumber } = require("../../utils/randomNumber")

const sendPdfFile = catchAsync(async (req, res, next) => {
  const pdfFile = fs.readFileSync(`${process.cwd()}/src/pdf/shakir-uet.pdf`)
  const pdfDoc = await PDFDocument.load(pdfFile)
  const ppmCode = generateRandomNumber()
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
  fs.writeFileSync(
    `${process.cwd()}/downloads/${ppmCode}.pdf`,
    modifiedPdfBytes
  )

  res.setHeader("Content-Disposition", `attachment; filename="${ppmCode}.pdf"`)
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Transfer-Encoding", "binary")

  res.end(modifiedPdfBytes, "binary")
})

module.exports = sendPdfFile
