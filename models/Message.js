const mongoose = require("mongoose");
const timestampPlugin = require("./plugins/timestamp");

let messageSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "text"
  },
  value: String,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

messageSchema.plugin(timestampPlugin);

module.exports = mongoose.model("Message", messageSchema);
