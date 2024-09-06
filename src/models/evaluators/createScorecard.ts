/**
 * @file createScorecard.ts
 * @description This file is responsible for creating a scorecard for the modules based on their type
 * 
 */

import { Scorecard } from "../scores/scorecard";
import { URL } from 'url';

export function createScorecard(url: string): Scorecard {
    
    const urlObject = new URL(url);

    if (urlObject.hostname.includes("github.com")) {
        return new Scorecard(url, url);
    } else if (urlObject.hostname.includes("npmjs.com")) {
        return new Scorecard(url, url);
    } else {
        throw new Error("Invalid URL");
    }
}