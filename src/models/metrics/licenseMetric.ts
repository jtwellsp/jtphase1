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

            // Check if the license is set in the LICENSE file
            if (data.license) {
                if (data.license.spdx_id != null && this.approvedLicensesIdentifiers.includes(data.license.spdx_id)) {
                    card.license = 1;
                } else {
                    card.license = 0;
                }
            } else {
                card.license = 0;
            }

            // Check the README if the license is not set in the LICENSE file
            if (card.license === 0) {
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

                // Decode the content
                const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
                if (this.checkLicenseInReadme(readmeContent)) {
                    card.license = 1;
                }
            }

            // Set the total latency for license evaluation
            card.license_Latency = parseFloat(((totalLatency) / 1000).toFixed(3));;
            
        } catch (error) {
            console.error('Error fetching license information:', error);
            card.license = 0;
            card.license_Latency = 0; // Set latency to 0 in case of error
        }
    }

    // Check if the approved license is in the README
    private checkLicenseInReadme(content: string): boolean {
        return this.approvedLicensesNames.some(keyword => content.includes(keyword));
    }
}
