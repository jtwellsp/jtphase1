/**
 * @file rampUpMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
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
        logger.debug(`${this.constructor.name} initialized with GitHub API.`);
    }

    public async evaluate(card: Scorecard): Promise<void> {
        this.logEvaluationStart(card);
        
        try {
            // Measure start time
            const startTime = Date.now();

            // Fetch the README file from the repository
            logger.debug(`Fetching README for ${card.owner}/${card.repo}...`);
            const readmeData = await this.octokit.repos.getReadme({
                owner: card.owner,
                repo: card.repo,
            });

            // Measure end time
            const endTime = Date.now();
            const latency = endTime - startTime;
            card.rampUp_Latency = latency;

            logger.info(`Fetched README for ${card.owner}/${card.repo}, API Latency: ${latency} ms`);

            // Decode the README content
            const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
            logger.debug(`README content fetched and decoded for ${card.owner}/${card.repo}.`);

            // Analyze README content to compute score
            const readmeScore = this.analyzeReadme(readmeContent);
            card.rampUp = readmeScore;
            logger.info(`Ramp-up score for ${card.owner}/${card.repo} computed: ${readmeScore}`);

        } catch (error) {
            logger.error(`Error fetching README information for ${card.owner}/${card.repo}: ${error.message}`);
            card.rampUp = 0;
        }

        this.logEvaluationEnd(card);
    }

    private analyzeReadme(content: string): number {
        logger.debug(`Analyzing README content...`);
        let score = 0;

        // Check for key sections in the README
        const sections = ['Installation', 'Usage', 'Contributing', 'License'];
        sections.forEach(section => {
            const regex = new RegExp(`#\\s*${section}`, 'i');
            if (regex.test(content)) {
                score += 0.2;
                logger.debug(`Section "${section}" found in README.`);
            } else {
                logger.debug(`Section "${section}" not found in README.`);
            }
        });

        // Lint the README for quality and markdown errors
        logger.debug(`Linting the README content...`);
        const options = { strings: { content }, config: { default: true } };
        const lintResults = markdownlint.sync(options);

        const lintScore = lintResults.toString().split('\n').length > 0 ? 0 : 0.2;
        score += lintScore;
        logger.debug(`README lint score: ${lintScore}`);

        // Ensure the score is between 0 and 1
        const finalScore = Math.min(score, 1);
        logger.debug(`Final README score: ${finalScore}`);
        return finalScore;
    }
}
