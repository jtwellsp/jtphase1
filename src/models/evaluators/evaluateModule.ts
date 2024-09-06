import { Scorecard } from '../scores/scorecard';
import { createScorecard } from './createScorecard';
import { Metric } from '../metrics/metric';
import { LicenseMetric } from '../metrics/licenseMetric';

const metrics: Metric[] = []
metrics.push(new LicenseMetric());

export async function evaluateModule(url: string): Promise<string> {
    // Import and call the createScorecard function
    console.log("I've made it to the evaluateModule function.");
    const scorecard: Scorecard = await createScorecard(url);
    console.log("Scorecard created.");
    console.log(scorecard.getResults());

    return scorecard.getResults();
}
   