/**
 * @file correctnessMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

/**
 * @class CorrectnessMetric
 * 
 */
export class CorrectnessMetric extends Metric {

    public async evaluate(card: Scorecard): Promise<void> {
        console.log('CorrectnessMetric evaluating scorecard');
        card.correctness = 2;
    }
}