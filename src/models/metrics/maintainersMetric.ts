/**
 * @file responsiveMaintainerMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class ResponsiveMaintainerMetric
 *
 * Evaluates maintainers' responsiveness by analyzing issue and PR response times.
 */
export class MaintainersMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    public async evaluate(card: Scorecard): Promise<void> {
        try {
            logger.info(`Evaluating maintainer responsiveness for ${card.owner}/${card.repo}`);

            const sinceDate = new Date();
            sinceDate.setMonth(sinceDate.getMonth() - 1); // Last 30 days
            logger.debug(`Fetching issues from the last 30 days (since: ${sinceDate.toISOString()})`);

            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                since: sinceDate.toISOString(),
                state: 'open',
                per_page: 100,
            });

            const issues = issuesData.data;
            logger.debug(`Fetched ${issues.length} open issues for evaluation`);

            if (issues.length === 0) {
                logger.info('No open issues found. Setting responsiveMaintainer score to 1.');
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
                    logger.debug(`Issue #${issue.number} - Response time: ${responseTime} hours`);
                } else {
                    logger.debug(`Issue #${issue.number} - No valid maintainer response found`);
                }
            }

            if (responseCount === 0) {
                logger.info('No responses found from maintainers. Setting responsiveMaintainer score to 0.');
                card.responsiveMaintainer = 0;
                return;
            }

            const averageResponseTime = totalResponseTime / responseCount;
            logger.debug(`Average response time: ${averageResponseTime} hours`);

            // Scoring logic based on average response time
            let responseScore = 1;
            if (averageResponseTime <= 24) {
                responseScore = 1;
                logger.info('Average response time is within 24 hours. Setting score to 1.');
            } else if (averageResponseTime <= 72) {
                responseScore = 0.7;
                logger.info('Average response time is within 72 hours. Setting score to 0.7.');
            } else if (averageResponseTime <= 168) {
                responseScore = 0.4;
                logger.info('Average response time is within 168 hours. Setting score to 0.4.');
            } else {
                responseScore = 0;
                logger.info('Average response time exceeds 168 hours. Setting score to 0.');
            }

            card.responsiveMaintainer = responseScore;

        } catch (error) {
            logger.error(`Error fetching responsiveness information for ${card.owner}/${card.repo}:`, error);
            card.responsiveMaintainer = 0;
        }
    }

    private async getFirstResponseTime(card: Scorecard, issue: any): Promise<number | null> {
        try {
            logger.debug(`Fetching comments for issue #${issue.number}`);
            
            const commentsData = await this.octokit.issues.listComments({
                owner: card.owner,
                repo: card.repo,
                issue_number: issue.number,
            });

            const comments = commentsData.data;

            for (const comment of comments) {
                if (comment.user) {
                    logger.debug(`Checking if comment by ${comment.user.login} is from a collaborator`);
                    const isCollaborator = await this.octokit.repos.checkCollaborator({
                        owner: card.owner,
                        repo: card.repo,
                        username: comment.user.login,
                    }).then(() => true).catch(() => false);
            
                    if (isCollaborator) {
                        const issueCreatedAt = new Date(issue.created_at);
                        const commentCreatedAt = new Date(comment.created_at);
                        const responseTime = (commentCreatedAt.getTime() - issueCreatedAt.getTime()) / (1000 * 60 * 60);
                        logger.debug(`First response from collaborator ${comment.user.login}: ${responseTime} hours after issue creation`);
                        return responseTime;
                    }
                }
            }

            logger.debug(`No collaborator response found for issue #${issue.number}`);
            return null;
        } catch (error) {
            logger.error(`Error fetching comments or checking collaborator status for issue #${issue.number}:`, error);
            return null;
        }
    }
}
