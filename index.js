const express = require("express");
const cors = require("cors");
const app = express();

//middleware

app.use(express.json())
app.use(cors())

//routes 

app.use("/auth", require("./routes/auth"));

app.use("/room", require("./routes/room"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static("build"));
	app.get("*", (req, res) => {
	  res.sendFile(path.resolve(__dirname,  "build", "index.html"));
	});
  }


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
