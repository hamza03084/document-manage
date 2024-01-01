require("dotenv").config()
const mongoose = require("mongoose")
const app = require("./src/app")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const DB = process.env.DATABASE_URl.replace(
  "<DATABASE_NAME>",
  process.env.DATABASE_NAME
)

mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful!")
})

const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`Server is running on ${PORT}`))