/**
 * @function readURLsFromFile
 * 
 * Reads URLs from a file and passes them to evaluateModule function
 * 
 * @param {string} filePath : Path to the file containing URLs
 */
import * as fs from 'fs';
import {evaluateModule} from './evaluateModule.js';
import { pino } from 'pino';
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    },
});

export function readURLsFromFile(filePath: string): void {
    logger.info(`Reading URLs from file: ${filePath}`);
    fs.readFile(filePath, 'utf8', async (err: NodeJS.ErrnoException | null, data: string | null) => {
        if (err) {
            logger.error(`Error reading file: ${err.message}`);
            return;
        }

        if (data === null) {
            logger.error('Error: File data is null.');
            return;
        }

        const urls: string[] = data.split('\n').filter(url => url.trim() !== '');
        logger.info(`Found ${urls.length} URL(s) in the file.`);
        for (const url of urls) {
            try {
                logger.info(`Evaluating module at URL: ${url}`);
                const result: string = await evaluateModule(url);
                logger.info(`Results for ${url}: ${result}`);
                
            } catch (error) {
                logger.error(`Error evaluating module at ${url}: ${error}`);
            }
        }
    });
}
