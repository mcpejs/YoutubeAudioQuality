const express = require("express");
const request = require("request");
const app = express();

app.set("view engine", "ejs");

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
