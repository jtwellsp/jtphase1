"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateModule = evaluateModule;
const createScorecard_1 = require("./createScorecard");
const licenseMetric_1 = require("../metrics/licenseMetric");
const metrics = [];
metrics.push(new licenseMetric_1.LicenseMetric());
function evaluateModule(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Import and call the createScorecard function
        console.log("I've made it to the evaluateModule function.");
        const scorecard = yield (0, createScorecard_1.createScorecard)(url);
        console.log("Scorecard created.");
        console.log(scorecard.getResults());
        return scorecard.getResults();
    });
}
