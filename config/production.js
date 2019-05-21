module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "simple-chat-api",
  DB_URI: process.env.DB_URI
};
