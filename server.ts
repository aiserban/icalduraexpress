import express from 'express'
import Db from './src/service/db/db'
import path from 'path'

const app = express()
const port = 3005

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist"));
});

app.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
})

app.listen(port, () => {
  console.log(`iCaldura listening on port ${port}`)
})  