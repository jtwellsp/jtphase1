import { Scorecard } from '../scores/scorecard';
import { Metric } from './metric';


export class BusFactorMetric extends Metric {

  
    public evaluate(card: Scorecard): void {
        /*
        try {
            const contributors = await this.getContributors(card.urlRepo);
            const busFactorScore = this.calculateBusFactor(contributors);

            // Update the scorecard with the calculated Bus Factor score and latency
            card.busFactor = busFactorScore;
            card.busFactor_Latency = await this.simulateLatency(); // Simulated latency for now

        } catch (error) {
            console.error(`Error evaluating bus factor for ${card.urlRepo}: `, error);
            card.busFactor = 0;
            card.busFactor_Latency = 0;
        }
            */
    }
}