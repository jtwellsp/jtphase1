import { Scorecard } from "../scores/scorecard";

export abstract class Metric {
    public abstract evaluate(card: Scorecard): void;
}