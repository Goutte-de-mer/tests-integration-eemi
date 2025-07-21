const mongoose = require("mongoose");
require("dotenv").config();

const connectionString =
  process.env.CONNECTION_STRING || "mongodb://localhost:27017/test_database";

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
