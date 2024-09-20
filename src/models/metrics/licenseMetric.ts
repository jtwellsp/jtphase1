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

    // Evaluate the license metric
    public async evaluate(card: Scorecard): Promise<void> {
        
    }    
}