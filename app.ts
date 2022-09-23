import express from 'express'
import Scraper from './src/scraping/scraper'
import mongoose from 'mongoose'
import Db from './src/db/db'

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/icaldura').then(() => {
  console.log('--- Database connected ---');
}).then(async () => {
  // await Db.clearDb();
}).catch(err => {
  console.log('Error: ' + err);
})


app.get('/', async (req, res) => {
  let result = await Scraper.parseData();
  let str = '';

  for (let i = 0; i < result.length; i++) {
    Db.saveIfNotExist(result[i]);

    str = str.concat(
      result[i].roadType,
      result[i].street,
      result[i].blocks.toString(),
      result[i].description,
      result[i].district,
      result[i].issueType,
      '<br>'
    )
  }
  res.send('Hello World! <br>'+str)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})