"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseMetric = void 0;
const metric_1 = require("./metric");
class LicenseMetric extends metric_1.Metric {
    evaluate(card) {
        throw new Error('Method not implemented.');
    }
}
exports.LicenseMetric = LicenseMetric;
