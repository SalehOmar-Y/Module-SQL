const express = require("express");
const app = express();
app.use(express.json());

app.get("/products", (req, res) => {
  res.status(200).json([
    {
      name: "Test Product",
      price: 25,
      supplierName: "Test Supplier",
    },
  ]);
});  
module.exports = app;
