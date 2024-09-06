/**
 * @file index.ts
 * @description Entry point of the API
 * Here we are creating a simple express server.
 * The server listens for requests made and processes the URLs accordingly.
 */

// Express module is used to create the server (REST API)
import express, { Express, Request, Response } from "express";
// Dotenv module reads the .env file allows environment variables to be utilized.
import dotenv from "dotenv";
import { processURL } from "./processURL";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/process-url", async (req: Request, res: Response) => {
    
    const { url } = req.body;

    // Check that a URL is provided
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Pass the URL to the processURL function
        const result = await processURL(url);
        res.json({url: url, message: "URL processed successfully", result: result});
    } catch (error) {
        res.status(500).json({ error: "Error processing URL" });   
    }    

});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});