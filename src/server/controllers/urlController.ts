import { Request, Response } from 'express';
import { URL } from 'url';
import URLServices from '../services/urlServices';

class URLController {
       
    public static processURL(req: Request, res: Response): void {
        
        const { url } = req.body;

        // Validate the URL format
        try {
            const urlObject = new URL(url);
            const response = URLServices.beginScoringModule(url);

        } catch (error) {
            res.status(400).send("Invalid URL");
        }
    }
}

export default URLController;