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

// app.get('/api/street/:name', async (req, res) => {
//   const re = new RegExp(`.*${req.params.name}.*`, 'i');
//   const query = { street: re };

//   Db.findMany(query).then(results => {
//     res.send(results);
//   }).catch(err => {
//     console.log(err);
//   })
// })

app.get('/api/issue/:street/', async (req, res) => {
  const re = new RegExp(`.*${req.params.street}.*`, 'i');
  const query = { street: re };

  Db.findDistinct('street', query).then((results) => {
    res.send(results);
  }).catch((err) => {
    console.log(err);
  })
}
)

app.get('/api/issue/:street/:blocks/', async (req, res) => {
  if (req.params.blocks === 'all') {
    const query = { street: req.params.street };

    Db.findDistinct('blocks', query).then((results) => {
      res.send(results);
    }).catch((err) => {
      console.log(err);
    })
  } else {
    res.sendStatus(404)
  }
})

app.get('/api/issue/:street/:blocks/:from', async (req, res) => {
  if (req.params.blocks === 'all') {
    Db.getChartData(req.params.street, new Date(req.params.from)).then((results) => {
      res.send(results);
    })
  } else {
    res.sendStatus(404)
  }
})

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})