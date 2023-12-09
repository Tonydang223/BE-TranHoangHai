const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyPar = require("body-parser");
const path = require("path");
const routes = require("./src/routes/index");
const cookieParser = require("cookie-parser");
const dbConnect = require("./src/config/dbConnection");
const http = require("http").createServer(app);
const PORT = process.env.PORT || 8088;
require("dotenv").config();

app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Welcom Nam Y Đường Server");
});

app.use(
  bodyPar.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);
app.use(bodyPar.json({ limit: "50mb", extended: true }));
app.use(morgan("combined"));

app.use(cors());
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

dbConnect.connect();
routes(app);

http.listen(PORT, () => {
  console.log(`Hoang Hai app back-end listen on port: 
http://localhost:${PORT}`);
});
