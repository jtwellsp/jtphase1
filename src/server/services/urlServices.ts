

import { evaluateModule } from "../../models/evaluators/evaluateModule";

class URLServices {

    public static async beginScoringModule(url: string): Promise<string> {
        console.log("Trying to start scoring the module in URL Services.");
        
        const result = await evaluateModule(url);

        console.log(result);
        return result;
    }

}

export default URLServices;