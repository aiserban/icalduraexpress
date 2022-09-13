import express from 'express'
import Scraper from './src/scraping/scraper'

const app = express()
const port = 3000


app.get('/', async (req, res) => {
  await Scraper.getRowCount();
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})