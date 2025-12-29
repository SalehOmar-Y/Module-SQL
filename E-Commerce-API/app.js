const express = require("express");
const app = express();
app.use(express.json());

app.get("/products", (req, res) => {
  res.status(200).json([
    { name: "laptop",price: 2500, supplierName: "Dell" },
    { name: "phone",price: 800, supplierName: "Apple" },
    { name: "tablet",price: 600, supplierName: "Samsung" },
  ]);
});


module.exports = app;
