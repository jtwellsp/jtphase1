/**
 * @file processURL
 * @definition Process the URL select the appropriate ModuleEvaluator to handle the request.
 * The ModuleEvaluator will then process the URL and return the appropriate results.
 * 
 */


// Import url module to parse the URL
import { URL } from "url";

/**
 * @function processURL
 * @param url - The URL to be processed
 * 
 */

// [TODO]: processURL returns appropriate results format
export const processURL = (url: string): Promise<string> => {
    try {
        // Validate the URL format
        const urlObject = new URL(url);

        if (urlObject.hostname.includes("github.com")) {
            // Process the URL using the GitHub ModuleEvaluator
            return Promise.resolve("GitHub ModuleEvaluator");
        } else if (urlObject.hostname.includes("npm.com")) {
            // Process the URL using the NPM ModuleEvaluator
            return Promise.resolve("NPM ModuleEvaluator");
        } else {
            return Promise.resolve("URL not supported");
        }
    } catch (error) {
        return Promise.reject(error);
    }
};