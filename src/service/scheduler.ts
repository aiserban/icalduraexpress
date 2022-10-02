import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import Db from '../db/db';
import scraper from './scraping/scraper'

const scheduler = new ToadScheduler();

const fetchDataTask = new AsyncTask(
    'fetchData',
    async () => {
        scraper.scrapData().then((data) => {
            for (let i = 0; i < data.length; i++) {
                Db.addIfNotExists(data[i]);
            }
        }).then(() => {
            console.log('Job executed successully at', new Date().toISOString());
        })
    }
)

const fetchDataJob = new SimpleIntervalJob({ hours: 1, runImmediately: true }, fetchDataTask);

export function startJobs() {
    scheduler.addSimpleIntervalJob(fetchDataJob);
}
