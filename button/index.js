const express = require("express");
const nocache = require('nocache');
const temperatur = require("./routes/temperatur.js");
const tx = require("./routes/tx.js");
const rx = require("./routes/rx.js");
const pods = require("./routes/pods.js");
const namespaces = require("./routes/namespaces.js");

const app = express();
app.use(nocache());

app.get("/button", (req, res) => res.send("Buttons"));
app.get("/button/tempe", temperatur());
app.get("/button/nettx", tx());
app.get("/button/netrx", rx());
app.get("/button/pods", pods());
app.get("/button/ns", namespaces());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
