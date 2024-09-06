import { Request, Response } from 'express';
import { URL } from 'url';
import URLServices from '../services/urlServices';

class URLController {
       
    public static async processURL(req: Request, res: Response): Promise<void> {
        
        console.log("Processing URL in the URL Controller.");
        const { url } = req.body;

        // Validate the URL format
        try {
            const urlObject = new URL(url);
            const response = await URLServices.beginScoringModule(url);
            res.send(response);

        } catch (error) {
            res.status(400).send("Invalid URL");
        }
    }
}

export default URLController;