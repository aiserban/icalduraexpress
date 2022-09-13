import express from 'express'
import scrapper from "./src/scrap/scrapper"

const app = express()
const port = 3000


app.get('/', async (req, res) => {
  let data = await scrapper();
  // console.log("data");
  res.send('Hello World!' + data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})