import express from 'express'
import Scraper from './src/scraping/scraper'
import mongoose from 'mongoose'
import Db from './src/db/db'

const app = express()
const port = 3000

Db.connect();

app.get('/', async (req, res) => {
  let result = await Scraper.parseData();
  let str = '';

  for (let i = 0; i < result.length; i++) {
    await Db.addIfNotExists(result[i]);
  }

  await Db.findMany({}).then((results) => {
    for (let i = 0; i < results.length; i++) {
      str = str.concat(results[i].street);
    }
  })

  res.send('Hello World! <br>'+str)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})