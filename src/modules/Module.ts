/**
 * @class Module
 * @description This class serves as the framework modules
 * 
 */

export abstract class Module {
    url: string;
    netScore: number;
    netScore_Latency: number;
    rampUp: number;
    rampUp_Latency: number;
    correctness: number;
    correctness_Latency: number;
    busFactor: number;
    busFactor_Latency: number;
    responsiveMaintainer: number;
    responsiveMaintainer_Latency: number;
    license: number;
    license_Latency: number
    
    constructor(url: string) {
        this.url = url;
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
    public calculateNetScore(): void {
        this.netScore = (this.rampUp + this.correctness + this.busFactor + this.responsiveMaintainer + this.license) / 5;
    }

    public getResults(): string {
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