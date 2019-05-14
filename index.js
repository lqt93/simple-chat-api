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

// Routes
app.use("/users", require("./routes/users"));
app.use("/rooms", UserHelpers.validateUser, require("./routes/rooms"));
app.use("/messages", UserHelpers.validateUser, require("./routes/messages"));

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
