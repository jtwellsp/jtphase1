import express, { Request, Response } from 'express';
require('dotenv').config();

const { sayHello } = require('./example.js');


const apiKey: string = process.env.GITHUB_TOKEN!;

const app = express();
const PORT = 3000;

app.get ('/', (req: Request, res: Response) => {
    res.send(sayHello(apiKey));
});

/**
 * Start the Express server
 * @param port - The port number to run the server on
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

