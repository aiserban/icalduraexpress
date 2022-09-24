import express from 'express'
import Scraper from './src/scraping/scraper'
import Db from './src/db/db'
import { startJobs } from './src/scheduler'

const app = express()
const port = 3000

Db.connect().then(() => {
  startJobs();
})

app.get('/', async (req, res) => {
  let result = await Scraper.scrapData();
  let str = '';

  for (let i = 0; i < result.length; i++) {
    await Db.addIfNotExists(result[i]);
  }

  await Db.findMany({}).then((results) => {
    for (let i = 0; i < results.length; i++) {
      str = str.concat(results[i].street);
    }
  })

  res.send('Hello World! <br>' + str)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})