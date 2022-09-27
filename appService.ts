import Db from './src/service/db/db'
import { startJobs } from './src/service/scheduler'

Db.connect().then(async () => {
    // await Db.clearDb();
    startJobs();
})