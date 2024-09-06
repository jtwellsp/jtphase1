import { Scorecard } from '../scores/scorecard';
import { Metric } from './metric';

export class LicenseMetric extends Metric {
    public evaluate(card: Scorecard): void {
        throw new Error('Method not implemented.');
    }
    // Add your implementation here
}