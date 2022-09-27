import express from 'express'
import Db from './src/service/db/db'

const app = express()
const port = 3005

app.get('/', async (req, res) => {
  res.send('Hello World! <br>')
})

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})