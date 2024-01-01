const express = require("express");
const cors = require("cors");
const api = require("./api");
const globalErrorHandler = require("./handler/errorHandler");
const aws = require("aws-sdk");
const app = express();

app.use(cors());

app.use(express.json());
app.use('/public', express.static(__dirname + '/../public'));

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

app.get("/download", async (req, res) => {
  try {
    const { fileName } = req.query;

    const exists = await s3
      .headObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${fileName}.pdf`,
      })
      .promise();

    if (!exists) {
      return res.status(404).send("URL expired");
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}.pdf`,
    });

    const stream = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${fileName}.pdf`,
      })
      .createReadStream();
    await stream.pipe(res);

    setTimeout(() => {
      s3.deleteObject(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `${fileName}.pdf`,
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }, 5000);
  } catch (err) {
    console.log(err);
    res.status(404).send(`<h1>URL expired</h1>`);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running...",
  });
});

app.use("/api", api);

app.use(globalErrorHandler);

module.exports = app;
