import { Scorecard } from '../scores/scorecard';
import { Metric } from './metric';
import axios from 'axios';

export class BusFactorMetric extends Metric {

    // Method to fetch contributors from the repository
    private async getContributors(urlRepo: string, contributor: string): Promise<string[]> {
        try {
            const repoPath = urlRepo.replace('https://github.com/cs-450-project/se-phase1', '');
            const response = await axios.get(`https://api.github.com/repos/${repoPath}/contributors`);
            return response.data.map((contributor: any) => contributor.login);
        } catch (error) {
            console.error(`Error fetching contributions for ${contributor} in ${urlRepo}: `, error);
            return [];
        }
    }

    // Method to calculate the bus factor based on contributors
    private async calculateBusFactor(urlRepo: string, contributors: string[]): Promise<number> {
        const contributions = await Promise.all(contributors.map(contributor => this.getContributors(urlRepo, contributor)));
        const totalContributions = contributions.reduce((a, b) => a + b.length, 0);
        const criticalContributors = contributions.filter(contributor => contributor.length > totalContributions / contributors.length);
        return criticalContributors.length;
    }

    // Method to simulate latency
    private async simulateLatency(): Promise<number> {
        return new Promise(resolve => setTimeout(() => resolve(100), 1000));
    }

    // Evaluate method to calculate and update the bus factor
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            const contributors = await this.getContributors(card.urlRepo, 'contributor');
            const busFactorScore = await this.calculateBusFactor(card.urlRepo, contributors);

            // Update the scorecard with the calculated Bus Factor score and latency
            card.busFactor = busFactorScore;
            //card.busFactor_Latency = await this.simulateLatency(); 

        } catch (error) {
            console.error(`Error evaluating bus factor for ${card.urlRepo}: `, error);
            card.busFactor = 0;
            card.busFactor_Latency = 0;
        }
          
    }
}