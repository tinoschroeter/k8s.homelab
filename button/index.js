const express = require("express");
const nocache = require("nocache");
const cache = require("express-memjs-cache");
const morgan = require("morgan");
const temperatur = require("./routes/temperatur.js");
const tx = require("./routes/tx.js");
const rx = require("./routes/rx.js");
const pods = require("./routes/pods.js");
const namespaces = require("./routes/namespaces.js");
const uptime = require("./routes/uptime.js");
const load = require("./routes/load.js");
const mem = require("./routes/mem.js");

const app = express();
app.use(nocache());
app.use(morgan("combined"));

const promBundle = require("express-prom-bundle");
app.use(
  "/",
  promBundle({
    includePath: true,
    includeMethod: true,
    promClient: {
      collectDefaultMetrics: {},
    },
  })
);

const cacheMaxAge = process.env.CACHE_MAX_AGE || 120;
app.use(cache({ cacheMaxAge }));

app.get("/button", (req, res) => res.send("Buttons"));
app.get("/button/health", (req, res) => res.status(200).end());

app.get("/button/tempe", temperatur());
app.get("/button/nettx", tx());
app.get("/button/netrx", rx());
app.get("/button/pods", pods());
app.get("/button/ns", namespaces());
app.get("/button/uptime", uptime());
app.get("/button/load", load());
app.get("/button/mem", mem());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
