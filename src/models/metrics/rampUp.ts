import { Scorecard } from '../scores/scorecard';
import { Metric } from './metric';

export class RampUpMetric extends Metric{
    public evaluate(card: Scorecard): void{
        //try {
            //const readmeContent = await this.getReadmeContent(card.urlRepo);
            //const readmeScore = this.evaluateReadmeQuality(readmeContent);
            //const docScore = await this .checkDocumentation(card.urlRepo);

            //const ramupUpscore = (readmeScore * 0.7) + (docScore * 0.3);
        //}
    }
}