const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");

// Initialize database connector
const Database = require("./Database");

// Validate JWT token
const jwt = require("jsonwebtoken");
function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], config.JWT_SECRET, function(
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

// Apply CORS
app.use(cors());

// Parsing request's body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Routes
app.use("/users", require("./routes/users"));

// UI experiment
app.get("/experiment", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

io.on("connection", socket => {
  console.log("an user connected");
  socket.on("chat message", msg => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(8000, () => {
  console.log("listening on *:8000");
});
