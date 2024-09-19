/**
 * @file rampupMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

/**
 * @class RampUpMetric
 * 
 */
export class RampUpMetric extends Metric {

    public async evaluate(card: Scorecard): Promise<void> {
        console.log('RampUpMetric evaluating scorecard');
        card.rampUp = 5;
    }
}