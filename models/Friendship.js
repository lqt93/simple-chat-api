const mongoose = require("mongoose");
const timestampPlugin = require("./plugins/timestamp");

const ModelName = "Friendship";

let friendShipSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    default: "waiting"
  },
  watched: Boolean
});

friendShipSchema.plugin(timestampPlugin);

module.exports = mongoose.model(ModelName, friendShipSchema);
