const mongoose = require("mongoose");
const timestampPlugin = require("./plugins/timestamp");

const modelName = "RoomParticipant";

let schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  status: {
    type: String,
    default: "active"
  }
});

schema.plugin(timestampPlugin);

module.exports = mongoose.model(modelName, schema);
