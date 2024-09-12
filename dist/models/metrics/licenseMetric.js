/**
 * @file licenseMetric.ts
 *
 */
import { Metric } from './metric';
/**
 * @class LicenseMetric
 *
 * This class will evaluate the license metric of the module.
 * The GitHub API will be used to obtain the license information.
 * It will be compared to the approved license.
 *
 */
export class LicenseMetric extends Metric {
    evaluate(card) {
        throw new Error('Method not implemented.');
    }
}
