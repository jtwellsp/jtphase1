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
 * 
 * @param {string} url : URL of the module
 * @returns {Scorecard} : Scorecard object for the module
 */
export async function createScorecard(url: string): Promise<Scorecard> {
    
    const trimmed = url.trim();
    logger.info(`Creating scorecard for URL: ${trimmed}`);
    // Create URL object from the URL passed to the API
    const urlObject = new URL(trimmed);

    // Check the hostname of the URL to pass the correct URLs to the setGitHubAttributes function
    if (urlObject.hostname.includes("github.com")) {
        return setGitHubAttributes(trimmed, trimmed);
    } else if (urlObject.hostname.includes("npmjs.com")) {
        logger.info(`Detected npm URL: ${trimmed}`);
        const repoUrl = await getNpmRepoURL(trimmed);
        return setGitHubAttributes(trimmed, repoUrl);
    } else {
        logger.error(`Invalid URL: ${trimmed}`);
        throw new Error("Invalid URL");
    }
}


/**
 * @function getNpmRepoURL
 * 
 * @param url 
 * @returns GitHub repository URL for an npm module
 */
async function getNpmRepoURL(url: string): Promise<string> {
    const npmApiUrl = url.replace(/(?<=\/)www(?=\.)/, 'replicate').replace('/package', '')
    logger.info(`Fetching repository URL from npm API: ${npmApiUrl}`); // Log the API URL
    const npmApiResponse = await fetch(npmApiUrl);
    const npmApiData = await npmApiResponse.json();
    const npmRepoUrl = npmApiData.repository.url;
    logger.info(`NPM Repository URL: ${npmRepoUrl}`); 
    return npmRepoUrl;
}

/**
 * @function setGitHubAttributes
 * 
 * @param url : URL of the module
 * @param urlRepo : GitHub repository URL
 * @returns Scorecard object with GitHub set attributes
 */
function setGitHubAttributes(url: string, urlRepo: string): Scorecard {
    const card = new Scorecard(url);
    card.owner = urlRepo.split('/')[3];
    card.repo = urlRepo.split('/')[4];
    if (card.repo.includes('.git')) {
        card.repo = card.repo.replace('.git', '');
    }
    return card
}