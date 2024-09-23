/**
 * @file createScorecard.ts
 * 
 */

import { Scorecard } from "../scores/scorecard.js";
import { URL } from 'url';
import { pino } from 'pino';
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    },
});

/**
 * @function createScorecard
 * 
 * This function creates a Scorecard object for the module based on the URL passed to it.
 * Here, we add the functionality for supporting npm and GitHub modules.
 * Currently, we're treating them the same, but in the future this is where we'll add the logic that obtains the GitHub repository URL from the npm module URL.
 * 
 * @param {string} url : URL of the module
 * @returns {Scorecard} : Scorecard object for the module
 */
export async function createScorecard(url: string): Promise<Scorecard> {
    
    const trimmed = url.trim();
    logger.info(`Creating scorecard for URL: ${trimmed}`);
    // Create URL object from the URL passed to the API
    const urlObject = new URL(trimmed);

    // Check the hostname of the URL to return the correct Screocard object
    if (urlObject.hostname.includes("github.com")) {
        logger.info(`Detected GitHub URL: ${trimmed}`);
        return new Scorecard(trimmed, trimmed);
    } else if (urlObject.hostname.includes("npmjs.com")) {
        logger.info(`Detected npm URL: ${trimmed}`);
        const repoUrl = await getNpmRepoURL(trimmed);
        logger.info(`Repository URL obtained: ${repoUrl}`);
        return new Scorecard(trimmed, repoUrl);
    } else {
        logger.error(`Invalid URL: ${trimmed}`);
        throw new Error("Invalid URL");
    }
    
}

async function getNpmRepoURL(url: string): Promise<string> {
    const npmApiUrl = url.replace(/(?<=\/)www(?=\.)/, 'replicate').replace('/package', '')
    logger.info(`Fetching repository URL from npm API: ${npmApiUrl}`); // Log the API URL
    const npmApiResponse = await fetch(npmApiUrl);
    const npmApiData = await npmApiResponse.json();
    const npmRepoUrl = npmApiData.repository.url;
    logger.info(`NPM Repository URL: ${npmRepoUrl}`); 
    return npmRepoUrl;
}