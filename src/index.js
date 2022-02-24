const express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json()); //this is needed to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", require("./routes"));


app.listen(3000, () => {
  console.log("listening on port 3000");
});
