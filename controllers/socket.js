module.exports = function(io) {
  io.on("connection", socket => {
    console.log("-------------\nan user connected");
    socket.on("join_room", roomId => {
      socket.join(roomId);
    });

    socket.on("send_message_to_room", (roomId, msg) => {
      // send a private message to the socket with the given id
      io.in(roomId).emit("room_msg", msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
