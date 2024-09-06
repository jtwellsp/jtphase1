import { Scorecard } from '../scores/scorecard';
import { createScorecard } from './createScorecard';
import { Metric } from '../metrics/Metric';
import { LicenseMetric } from '../metrics/LicenseMetric';

const metrics: Metric[] = []
metrics.push(new LicenseMetric());

export async function evaluateModule(url: string): Promise<string> {
    // Import and call the createScorecard function
    const scorecard: Scorecard = createScorecard(url);
    return Promise.resolve(scorecard.getResults());
}
   