/**
 * @file index.ts
 * @description Entry point of the API
 * Here we are creating a simple express server.
 * The server listens for requests made and processes the URLs accordingly.
 */


import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
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


import dotenv from "dotenv";
dotenv.config();

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