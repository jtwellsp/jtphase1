"use strict";
/**
 * @file index.ts
 * @description Entry point of the API
 * Here we are creating a simple express server.
 * The server listens for requests made and processes the URLs accordingly.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const evaluateModule_1 = require("./models/evaluators/evaluateModule");
const readurlsfromfile_1 = require("./models/evaluators/readurlsfromfile");
// Fill these in if you want to test while running in development mode
const testURL = "";
const testFile = "";
// Command line arguments
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('url', {
    alias: 'u',
    type: 'string',
    describe: 'URL of the module to evaluate'
})
    .option('file', {
    alias: 'f',
    type: 'string',
    describe: 'Path to the file containing the URLs'
})
    .parseSync();
// Get the URL and file from the command line arguments, or use testing values
const url = argv.url || testURL;
const file = argv.file || testFile;
// Call the evaluateModule function with the URL
if (url) {
    const result = (0, evaluateModule_1.evaluateModule)(url);
    console.log(result);
}
// [TODO] Add functionality to read URLs from a file
if (file) {
    //console.log(`File: ${file}`);
    (0, readurlsfromfile_1.readUrlsFromFile)(file);
}
/*
// Here is the server code for when we want to convert the project to an API
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import URLRoutes from "./server/routes/urlRoutes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/process-url', URLRoutes);

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
*/ 
