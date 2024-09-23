/**
 * @file busFactorMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class BusFactorMetric
 *
 * Evaluates the bus factor of the repository by analyzing the distribution of contributions among contributors.
 */
export class BusFactorMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    public async evaluate(card: Scorecard): Promise<void> {
        try {
            const contributorsData = await this.octokit.repos.listContributors({
                owner: card.owner,
                repo: card.repo,
                per_page: 100,
            });

            const contributors = contributorsData.data;

            if (contributors.length === 0) {
                card.busFactor = 0;
                return;
            }

            const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);

            const topContributions = contributors[0].contributions;

            const topContributorPercentage = topContributions / totalContributions;

            // Scoring logic based on top contributor's percentage
            if (topContributorPercentage >= 0.8) {
                card.busFactor = 0;
            } else if (topContributorPercentage >= 0.6) {
                card.busFactor = 0.2;
            } else if (topContributorPercentage >= 0.4) {
                card.busFactor = 0.5;
            } else {
                card.busFactor = 1;
            }

        } catch (error) {
            console.error('Error fetching contributors information:', error);
            card.busFactor = 0;
        }
    }
}
