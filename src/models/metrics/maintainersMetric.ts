/**
 * @file maintainerMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

/**
 * @class MaintainersMetric
 * 
 */
export class MaintainersMetric extends Metric {

    public async evaluate(card: Scorecard): Promise<void> {
        card.responsiveMaintainer = 4;
    }
}