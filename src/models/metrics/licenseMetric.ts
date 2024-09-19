/**
 * @file licenseMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class LicenseMetric
 * 
 * This class will evaluate the license metric of the module.
 * The GitHub API will be used to obtain the license information.
 * It will be compared to the approved license.
 * 
 */
export class LicenseMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
    }

    
    public async evaluate(card: Scorecard): Promise<void> {
        console.log('LicenseMetric evaluating scorecard');
        try {
            const { data } = await this.octokit.repos.get({
                owner: card.owner, 
                repo: card.repo,   
            });

            if (data.license) {
                console.log(`License: ${data.license.spdx_id}`);
                card.license = data.license.spdx_id === 'MIT' ? 1 : 0; // Example comparison
            } else {
                console.log('No license found');
                card.license = 0;
            }
        } catch (error) {
            console.error('Error fetching license information:', error);
            card.license = 0;
        }
    }
}