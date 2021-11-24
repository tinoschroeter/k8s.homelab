const app = require('express');
const k8s = require('@kubernetes/client-node');


app.get('/', (req, res) => {
    res.send("Hey")
})

const port = process.env.PORT || 30000
app.listen(port, () => {
    console.log(`Server is running on port ${port}!`)
})
