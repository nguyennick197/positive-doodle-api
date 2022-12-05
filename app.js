const express = require('express')
const cors = require('cors')
require('dotenv').config()

const doodleRouter = require('./routes/doodles')

const app = express()
app.use(cors())

const port = process.env.PORT || 3070;

app.use('/doodles', doodleRouter)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})