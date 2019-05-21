const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const UserHelpers = require("./helpers/user");

// Initialize database connector
const Database = require("./Database");

// Apply CORS
app.use(cors());

// Parsing request's body
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Add Socket.Io
app.use(function(req, res, next) {
  req.io = io;
  next();
});
require("./controllers/socket")(io);

// Routes
app.use("/users", require("./routes/users"));
app.use("/rooms", UserHelpers.validateUser, require("./routes/rooms"));
app.use("/messages", UserHelpers.validateUser, require("./routes/messages"));

// UI experiment
app.get("/experiment", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

const PORT = process.env.PORT || 8000;

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
