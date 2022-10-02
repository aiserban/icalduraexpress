import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import Db from '../db/db';
import scraper from './scraper'

const scheduler = new ToadScheduler();

const fetchDataTask = new AsyncTask(
    'fetchData',
    async () => {
        scraper.scrapData().then(async (data) => {
            for (let i = 0; i < data!.length; i++) {
                await Db.addIfNotExists(data![i]);
            }
        }).then(() => {
            console.log('Job executed successully at', new Date().toISOString());
        }).catch(err => {
            console.log('Job encountered an error at', new Date().toISOString(), '\n', err)
        })
    }
)

const fetchDataJob = new SimpleIntervalJob({ hours: 1, runImmediately: true }, fetchDataTask);

export function startJobs() {
    scheduler.addSimpleIntervalJob(fetchDataJob);
}
