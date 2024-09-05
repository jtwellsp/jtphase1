/**
 * Interface for module evaluators
 * @interface ModuleEvaluator
 */

export interface ModuleEvaluator {
    evaluateModule(module: string): void;
}