import express from 'express'
import { db } from './src/db/db'
import path from 'path'
import cors from 'cors'

const app = express()
const port = 3005

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));
app.use(cors());
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "dist"));
// });

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
})

/**
 * Used for searching for a street and returning results from the db
 */
app.get('/api/issue/:street/', async (req, res) => {
  db.findStreet(req.params.street).then((results) => {
    res.send(results);
  }).catch((err) => {
    console.log(err);
  })
})

app.get('/api/issue/:street/:blocks/:from', async (req, res) => {
  if (req.params.blocks === 'all') {
    db.getChartDataWithIssueCounts(req.params.street, new Date(req.params.from), new Date()).then(results => {
      res.send(results);
    }).catch(err => {
      console.log(err)
    })
  } else {
    db.getHistoricalDataForBlock(req.params.street, req.params.blocks, new Date(req.params.from)).then(results => {
      res.send(results);
    }).catch(err => {
      console.log(err)
    })
  }
})

/**
 * api/TOP/
 */
app.get('/api/top/blocks/:count', async (req, res) => {
  let limit = parseInt(req.params.count);
  if (limit === NaN) {
    limit = 10
  }

  db.getTopBlocks(limit).then(results => {
    res.send(results);
  }).catch(err => {
    console.log(err)
  })
})

// todo top streets

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})