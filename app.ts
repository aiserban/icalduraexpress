import express from 'express'
import Db from './src/service/db/db'

const app = express()
const port = 3005

app.get('/', async (req, res) => {
  let str = '';

  await Db.findMany({}).then((results) => {
    for (let i = 0; i < results.length; i++) {
      str = str.concat(results[i].street);
    }
  })

  res.send('Hello World! <br>' + str)
})

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})