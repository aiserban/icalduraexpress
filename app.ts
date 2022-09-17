import express from 'express'
import Scraper from './src/scraping/scraper'
import mongoose from 'mongoose'
import { IssueModel } from './src/schemas/issueSchema'

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/icaldura').then(() => {
  console.log('--- Database connected ---');
}).then(async () => {
  await IssueModel.deleteMany({});
  console.log('--- DATABASE CLEARED ---')
}).catch(err => {
  console.log('Error: ' + err);
})


app.get('/', async (req, res) => {
  let result = await Scraper.parseData();
  let str = '';

  for (let i = 0; i < result.length; i++) {
    const issue = new IssueModel(result[i])
    issue.save();
     IssueModel.find({
      street: /bai/gi,
      blocks: {
        value: /9/
      }
    }).then((res) => {
      console.log(res);
    });

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