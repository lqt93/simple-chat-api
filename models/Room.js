const mongoose = require("mongoose");
const timestampPlugin = require("./plugins/timestamp");

let roomSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "direct" // direct / group
  },
  name: String,
  status: {
    type: String,
    default: "active"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "RoomParticipant" }]
});

roomSchema.plugin(timestampPlugin);

module.exports = mongoose.model("Room", roomSchema);
