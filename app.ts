import express from 'express'
import Scraper from './src/service/scraping/scraper'
import Db from './src/service/db/db'
import { startJobs } from './src/service/scheduler'

const app = express()
const port = 3005

// Db.connect().then(async () => {
//   // await Db.clearDb();
//   startJobs();
// })



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