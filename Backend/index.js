const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const CustomerRouter = require("./Routes/CustomerRouter");
const InvoiceRouter = require("./Routes/InvoiceRouter");
const CategoryRouter = require("./Routes/CategoryRouter");

require("dotenv").config();

require("./Modals/db");

const PORT = process.env.PORT || 8080;

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);
app.use("/customer", CustomerRouter);
app.use("/invoice", InvoiceRouter);
app.use("/category", CategoryRouter);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT} `);
});
