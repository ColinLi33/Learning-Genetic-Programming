const express = require('express')
const app = express()
const port = 3333

app.use(express.static('public'))

app.get('/rocket', (req, res) => {
  res.sendfile('public/rocket.html')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
