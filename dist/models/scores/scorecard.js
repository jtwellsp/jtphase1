/**
 * @file scorecard.ts
 *
 */
/**
 * @class Scorecard
 *
 * This class holds all of the metric calculations carried out on the module.
 * It is responsible for calculating the net score and returning results in JSON format.
 *
 */
export class Scorecard {
    /**
     * @constructor
     *
     * The constuctor takes two url stings because npm modules will require a different initial URL than GitHub modules.
     *
     * @param {string} url
     * @param {string} urlRepo
     */
    constructor(url, urlRepo) {
        this.url = url;
        this.urlRepo = urlRepo;
        this.netScore = 0;
        this.netScore_Latency = 0;
        this.rampUp = 0;
        this.rampUp_Latency = 0;
        this.correctness = 0;
        this.correctness_Latency = 0;
        this.busFactor = 0;
        this.busFactor_Latency = 0;
        this.responsiveMaintainer = 0;
        this.responsiveMaintainer_Latency = 0;
        this.license = 0;
        this.license_Latency = 0;
    }
    // [TODO] Add weights
    calculateNetScore() {
        this.netScore = (this.rampUp + this.correctness + this.busFactor + this.responsiveMaintainer + this.license) / 5;
    }
    // convert all member variables to JSON
    getResults() {
        const scores = [
            { URL: this.url,
                NetScore: this.netScore,
                NetScore_Latency: this.netScore_Latency,
                RampUp: this.rampUp,
                RampUp_Latency: this.rampUp_Latency,
                Correctness: this.correctness,
                Correctness_Latency: this.correctness_Latency,
                BusFactor: this.busFactor,
                BusFactor_Latency: this.busFactor_Latency,
                ResponsiveMaintainer: this.responsiveMaintainer,
                ResponsiveMaintainer_Latency: this.responsiveMaintainer_Latency,
                License: this.license,
                License_Latency: this.license_Latency
            }
        ];
        return JSON.stringify(scores);
    }
}
