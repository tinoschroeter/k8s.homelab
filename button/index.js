const express = require("express");
const nocache = require('nocache');
const temperatur = require("./routes/temperatur.js");
const tx = require("./routes/tx.js");
const rx = require("./routes/rx.js");

const app = express();
//app.set('etag', false)
app.use(nocache());

app.get("/button", (req, res) => res.send("Buttons"));
app.get("/button/temp", temperatur());
app.get("/button/tx", tx());
app.get("/button/rx", rx());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
