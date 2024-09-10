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
if (argv.url) {
    console.log(`URL: ${argv.url}`);
}
if (argv.file) {
    console.log(`File: ${argv.file}`);
}
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Hello, World!");
/*
// Here is the server code for when we want to convert the project to an API
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
