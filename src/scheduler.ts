import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler'
import scraper from './scraping/scraper'

const scheduler = new ToadScheduler();

const fetchDataTask = new AsyncTask(
    'fetchData',
    async () => {
        scraper.scrapData();
        console.log("Job executed");
    }
)

const fetchDataJob = new SimpleIntervalJob({ hours: 1, runImmediately: true }, fetchDataTask);

export function startJobs() {
    scheduler.addSimpleIntervalJob(fetchDataJob);
}
