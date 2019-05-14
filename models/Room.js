const mongoose = require("mongoose");
const timestampPlugin = require("./plugins/timestamp");

let roomSchema = new mongoose.Schema({
  type: String,
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

roomSchema.plugin(timestampPlugin);

module.exports = mongoose.model("Room", roomSchema);
