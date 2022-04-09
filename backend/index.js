const express = require("express");
const app = express();
const port = 5000;
const connectToDB = require("./db");
const cors = require('cors')
connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//It parses incoming JSON requests from frontend and puts the parsed data in req.body
app.use(express.json());
app.use(cors())

//Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/project", require("./routes/ProjectRoutes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
