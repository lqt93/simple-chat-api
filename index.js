const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const config = require("./config");

// Initialize database connector
const Database = require("./Database");

// Set JWT token
const jwt = require("jsonwebtoken");
app.set("secretKey", config.JWT_SECRET); // jwt secret token
function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(
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

// Parsing request's body
app.use(bodyParser({ extended: false }));

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
