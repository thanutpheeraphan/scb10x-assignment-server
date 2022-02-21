const express = require("express");
const cors = require("cors");
const app = express();

//middleware

app.use(express.json())
app.use(cors())

//routes 

app.use("/auth", require("./routes/auth"));

app.use("/room", require("./routes/room"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});