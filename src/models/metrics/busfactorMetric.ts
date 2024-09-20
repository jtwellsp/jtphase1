/**
 * @file busfactorMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

/**
 * @class BusFactorMetric
 * 
 */
export class BusFactorMetric extends Metric {

    public async evaluate(card: Scorecard): Promise<void> {
        card.busFactor = 1;
    }
}