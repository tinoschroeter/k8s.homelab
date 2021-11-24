const express = require('express');
const k8s = require('@kubernetes/client-node');
const temperatur = require('./routes/temperatur.js');

const app = express()

app.get('/button', (req, res) => res.send("Buttons"))
app.get('/button/temp', temperatur())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}!`)
})
