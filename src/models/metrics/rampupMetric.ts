/**
 * @file rampUpMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

import { Octokit } from '@octokit/rest';
import markdownlint from 'markdownlint';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class RampUpMetric
 *
 * Evaluates the ramp-up time by analyzing the README and documentation.
 * Also calculates the latency of API requests to GitHub.
 */
export class RampUpMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    public async evaluate(card: Scorecard): Promise<void> {
        try {
            // Measure start time
            const fetchStartTime = Date.now();

            // Fetch the README file from the repository
            const readmeData = await this.octokit.repos.getReadme({
                owner: card.owner,
                repo: card.repo,
            });

            // Measure end time
            const fetchEndTime = Date.now();
            card.rampUp_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            

            const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');

            // Analyze README content to compute score
            const readmeScore = this.analyzeReadme(readmeContent);

            // Assign the score to the ramp-up field in Scorecard
            card.rampUp = Number(readmeScore.toFixed(3));

        } catch (error) {
            console.error('Error fetching README information:', error);
            card.rampUp = 0;
        }
    }

    private analyzeReadme(content: string): number {
        let score = 0;

        // Check for key sections in the README
        const sections = ['Installation', 'Usage', 'Contributing', 'License'];
        sections.forEach(section => {
            const regex = new RegExp(`#\\s*${section}`, 'i');
            if (regex.test(content)) {
                score += 0.2;
            }
        });

        // Lint the README for quality and markdown errors
        const options = { strings: { content }, config: { default: true } };
        const lintResults = markdownlint.sync(options);

        const lintScore = lintResults.toString().split('\n').length > 0 ? 0 : 0.2;
        score += lintScore;

        // Ensure the score is between 0 and 1
        return Math.min(score, 1);
    }
}
