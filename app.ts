import express from 'express'
import Scraper from './src/scraping/scraper'

const app = express()
const port = 3000


app.get('/', async (req, res) => {
  let result = await Scraper.parseData();
  let str = '';

  for (let i = 0; i < result.length; i++) {
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