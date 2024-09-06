import { Request, Response } from 'express';
import { URL } from 'url';

class URLController {
       
    public static processURL(req: Request, res: Response): void {
        
        const { url } = req.body;

        // Validate the URL format
        try {
            const urlObject = new URL(url);

            if (urlObject.hostname.includes("github.com")) {
                console.log("GitHubEvaluator");
                res.send("GitHub URL processed");
            } else if (urlObject.hostname.includes("npmjs.com")) {
                console.log("NPMEvaluator");
                res.send("NPM URL processed");
            } else {
                res.status(400).send("URL not supported");
            }
        } catch (error) {
            res.status(400).send("Invalid URL");
        }
    }
}

export default URLController;