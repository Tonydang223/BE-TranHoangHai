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

const prodOrigins = [
  'https://tonydang223.github.io',
  'https://tonydang223.github.io/Admin-THH',
  'https://fastidious-cranachan-f0cce4.netlify.app'
];
const devOrigin = ['http://127.0.0.1:5173'];
const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} not allowed by cors`));
        }
      } else {
        callback(null, true);
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
  }),
);
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

dbConnect.connect();
routes(app);

http.listen(PORT, () => {
  console.log(`Hoang Hai app back-end listen on port: 
http://localhost:${PORT}`);
});
