const express = require("express");
const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  // Your code to fetch products from the database should go here
  
// Your code to run the server should go here
// Don't hardcode your DB password in the code or upload it to GitHub! Never ever do this ever.
// Use environment variables instead:
// https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj

module.exports = app;
