const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_CONN_NEW;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => {
    console.log("connected failed", err);
  });
