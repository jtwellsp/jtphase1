import { evaluateModule } from "../../models/evaluators/evaluateModule";

class URLServices {

    public static beginScoringModule(url: string): Promise<string> {
        return Promise.resolve(evaluateModule(url));
    }

}

export default URLServices;