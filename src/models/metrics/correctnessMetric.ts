/**
 * @file correctnessMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class CorrectnessMetric
 *
 * Evaluates the correctness of the repository by checking for test suites and analyzing bug reports.
 */
export class CorrectnessMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    public async evaluate(card: Scorecard): Promise<void> {
        try {
            let correctnessScore = 0;

            // Check for test suite in package.json
            const hasTests = await this.checkForTests(card);
            correctnessScore += hasTests ? 0.5 : 0;

            // Analyze bug reports
            const bugScore = await this.analyzeBugs(card);
            correctnessScore += bugScore;

            // Ensure score is between 0 and 1
            card.correctness = Math.min(correctnessScore, 1);

        } catch (error) {
            console.error('Error evaluating correctness metric:', error);
            card.correctness = 0;
        }
    }

    private async checkForTests(card: Scorecard): Promise<boolean> {
        try {
            const packageJsonData = await this.octokit.repos.getContent({
                owner: card.owner,
                repo: card.repo,
                path: 'package.json',
            });

            const packageJsonContent = Buffer.from((packageJsonData.data as any).content, 'base64').toString('utf-8');
            const packageJson = JSON.parse(packageJsonContent);

            return !!(packageJson.scripts && packageJson.scripts.test);

        } catch {
            return false;
        }
    }

    private async analyzeBugs(card: Scorecard): Promise<number> {
        try {
            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                labels: 'bug',
                state: 'all',
                per_page: 100,
            });

            const issues = issuesData.data;
            const openBugs = issues.filter(issue => issue.state === 'open').length;
            const closedBugs = issues.filter(issue => issue.state === 'closed').length;

            const totalBugs = openBugs + closedBugs;
            if (totalBugs === 0) {
                return 0.5; // Neutral score if no bugs reported
            }

            const openBugRatio = openBugs / totalBugs;
            if (openBugRatio >= 0.5) {
                return 0; // Low score if many bugs are open
            } else if (openBugRatio >= 0.3) {
                return 0.1;
            } else if (openBugRatio >= 0.1) {
                return 0.3;
            } else {
                return 0.5;
            }

        } catch {
            return 0; // Low score if unable to fetch issues
        }
    }
}
