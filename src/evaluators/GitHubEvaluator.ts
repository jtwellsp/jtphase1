/** 
 * @class GitHubEvaluator
 */

import { ModuleEvaluator } from './ModuleEvaluator';

export class GitHubEvaluator implements ModuleEvaluator {

    // Implement the required methods from the ModuleEvaluator interface here
    evaluate(url: string): void {
        console.log("GitHubEvaluator");

    }
    
}
