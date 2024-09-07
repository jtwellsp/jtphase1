"use strict";
/**
 * @file createScorecard.ts
 * @description This file is responsible for creating a scorecard for the modules based on their type
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScorecard = createScorecard;
const scorecard_1 = require("../scores/scorecard");
const url_1 = require("url");
function createScorecard(url) {
    const urlObject = new url_1.URL(url);
    if (urlObject.hostname.includes("github.com")) {
        return new scorecard_1.Scorecard(url, url);
    }
    else if (urlObject.hostname.includes("npmjs.com")) {
        return new scorecard_1.Scorecard(url, url);
    }
    else {
        throw new Error("Invalid URL");
    }
}
