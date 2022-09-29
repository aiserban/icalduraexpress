import express from 'express'
import Db from './src/service/db/db'
import path from 'path'

const app = express()
const port = 3005

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "dist"));
// });

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
})

// app.get('/api/', async (req, res) => {
//   res.send(req.query);
// })

app.get('/api/street/:name', async (req, res) => {
  const re = new RegExp(`.*${req.params.name}.*`, 'i');
  const query = { street: re };

  Db.findMany(query).then(results => {
    res.send(results);
  }).catch(err => {
    console.log(err);
  })
})

app.get('/api/street/:name/:distinct', async (req, res) => {
  const re = new RegExp(`.*${req.params.name}.*`, 'i');
  const query = { street: re };

  if (Boolean(req.params.distinct) === true) {
    Db.findDistinct('street', query).then(results => {
      res.send(results);
    }).catch(err => {
      console.log(err);
    })
  } else {
    Db.findMany(query).then(results => {
      res.send(results);
    }).catch(err => {
      console.log(err);
    })
  }
})

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})