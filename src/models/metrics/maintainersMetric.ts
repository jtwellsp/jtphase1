/**
 * @file maintainersMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class MaintainersMetric
 *
 * Evaluates maintainers' responsiveness by analyzing issue and PR response times.
 */
export class MaintainersMetric extends Metric {

    private octokit: Octokit;

    /**
     * Constructor for the MaintainersMetric class.
     * Initializes the Octokit instance with the GitHub token from environment variables.
     */
    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    /**
     * Evaluates the responsiveness of maintainers by analyzing issue and PR response times.
     * @param card - The Scorecard instance to store the evaluation results.
     */
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            // Calculate the date one month ago from today
            const sinceDate = new Date();
            sinceDate.setMonth(sinceDate.getMonth() - 1);

            // Measure start time for fetching issues
            const fetchStartTime = Date.now();

            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                since: sinceDate.toISOString(),
                state: 'all',
                per_page: 100,
            });

            // Measure end time for fetching issues
            const fetchEndTime = Date.now();

            // Calculate latency in seconds and round to three decimal places
            card.responsiveMaintainer_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            

            const issues = issuesData.data;
            if (issues.length === 0) {
                card.responsiveMaintainer = 1;
                return;
            }

            let totalResponseTime = 0;
            let responseCount = 0;

            for (const issue of issues) {
                const responseTime = await this.getFirstResponseTime(card, issue);
                if (responseTime !== null) {
                    totalResponseTime += responseTime;
                    responseCount++;
                }
            }

            if (responseCount === 0) {
                card.responsiveMaintainer = 0;
                return;
            }

            const averageResponseTime = totalResponseTime / responseCount;
           

            let responseScore = 1;
            if (averageResponseTime <= 72) {  // Less than or equal to 3 days
                responseScore = 1;
            } else if (averageResponseTime <= 168) { // Less than or equal to 7 days
                responseScore = 0.7;
            } else if (averageResponseTime <= 336) { // Less than or equal to 14 days
                responseScore = 0.4;
            } else {  // More than 14 days
                responseScore = 0;
            }

            card.responsiveMaintainer = responseScore;

        } catch (error) {
            card.responsiveMaintainer = 0;
            card.responsiveMaintainer_Latency = 0;
        }
    }

  
    private async getFirstResponseTime(card: Scorecard, issue: any): Promise<number | null> {
        try {
            const commentsData = await this.octokit.issues.listComments({
                owner: card.owner,
                repo: card.repo,
                issue_number: issue.number,
            });

            const comments = commentsData.data;

            for (const comment of comments) {
                const validAssociations = ['COLLABORATOR', 'MEMBER', 'OWNER', 'CONTRIBUTOR'];
                if (comment.user && validAssociations.includes(comment.author_association)) {
                    const issueCreatedAt = new Date(issue.created_at);
                    const commentCreatedAt = new Date(comment.created_at);
                    const responseTime = (commentCreatedAt.getTime() - issueCreatedAt.getTime()) / (1000 * 60 * 60);
                    return responseTime;
                }
            }

            return null;
        } catch (error) {
            return null;
        }
    }
}