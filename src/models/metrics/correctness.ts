import { Scorecard } from '../scores/scorecard';
import { Metric } from './metric';

export class CorrectnessMetric extends Metric {

    public evaluate(card: Scorecard): void {
        /*
        try {
            const issuesCount = await this.getOpenIssues(card.urlRepo);
            const testCoverage = await this.checkTestCoverage(card.urlRepo);

            const correctnessScore = this.calculateCorrectness(issuesCount, testCoverage);

            card.correctness = correctnessScore;
            card.correctness_Latency = await this.simulateLatency(); // Simulated latency for now

        } catch (error) {
            console.error(`Error evaluating correctness for ${card.urlRepo}: `, error);
            card.correctness = 0;
            card.correctness_Latency = 0;
        }
        */
    }
}
