/**
 * @file licenseMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
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
    
    // Approved licenses
    private approvedLicensesIdentifiers: string[] = ['MIT', 'LGPL', 'Apache-1.0', 'Apache-1.1'];
    private approvedLicensesNames: string[] = ['MIT', 'GNU Lesser General Public License', 'Apache License 1.0', 'Apache License 1.1'];
    
    // Initialize instance of Octokit
    constructor() {
        super();
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
    }

    // Evaluate the license metric
    public async evaluate(card: Scorecard): Promise<void> {
        
        try {
            let totalLatency = 0;

            logger.info(`Starting license evaluation for repository ${card.owner}/${card.repo}`);
            logger.debug('Fetching repository data from GitHub API...');

            // Measure latency for fetching repository information
            const startRepoFetch = Date.now();

            // Fetch the repository information from the GitHub API
            const { data } = await this.octokit.repos.get({
                owner: card.owner, 
                repo: card.repo,   
            });

            const endRepoFetch = Date.now();
            const repoFetchLatency = endRepoFetch - startRepoFetch;
            totalLatency += repoFetchLatency; // Accumulate latency

            logger.debug(`Repository data fetched. API latency: ${repoFetchLatency} ms`);
            logger.debug('Checking if the repository has a LICENSE file...');

            // Check if the license is set in the LICENSE file
            if (data.license) {
                logger.debug(`License found in LICENSE file: ${data.license.spdx_id}`);
                if (data.license.spdx_id != null && this.approvedLicensesIdentifiers.includes(data.license.spdx_id)) {
                    card.license = 1;
                    logger.info(`Approved license found: ${data.license.spdx_id}`);
                } else {
                    card.license = 0;
                    logger.warn(`Unapproved license: ${data.license.spdx_id}`);
                }
            } else {
                card.license = 0;
                logger.warn('No LICENSE file found in the repository.');
            }

            // Check the README if the license is not set in the LICENSE file
            if (card.license === 0) {
                logger.debug('Checking README file for license information...');
                
                // Measure latency for fetching the README file
                const startReadmeFetch = Date.now();

                // Get README content
                const readmeData = await this.octokit.repos.getReadme({
                    owner: card.owner,
                    repo: card.repo,
                });

                const endReadmeFetch = Date.now();
                const readmeFetchLatency = endReadmeFetch - startReadmeFetch;
                totalLatency += readmeFetchLatency; // Accumulate latency

                logger.debug(`README file fetched. API latency: ${readmeFetchLatency} ms`);

                // Decode the content
                const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
                if (this.checkLicenseInReadme(readmeContent)) {
                    card.license = 1;
                    logger.info('Approved license found in README.');
                } else {
                    logger.warn('No approved license found in README.');
                }
            }

            // Set the total latency for license evaluation
            card.license_Latency = totalLatency;
            logger.info(`License evaluation completed. Total latency: ${totalLatency} ms`);

        } catch (error) {
            logger.error('Error fetching license information:', error);
            card.license = 0;
            card.license_Latency = 0; // Set latency to 0 in case of error
        }
    }

    // Check if the approved license is in the README
    private checkLicenseInReadme(content: string): boolean {
        logger.debug('Checking for approved license in README content...');
        const found = this.approvedLicensesNames.some(keyword => content.includes(keyword));
        if (found) {
            logger.debug('Approved license found in README content.');
        } else {
            logger.debug('No approved license found in README content.');
        }
        return found;
    }
}
