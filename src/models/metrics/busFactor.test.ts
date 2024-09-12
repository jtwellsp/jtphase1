import axios from 'axios';
import { BusFactorMetric } from './busFactor';
import { Scorecard } from '../scores/scorecard';

jest.mock('axios');

describe('BusFactorMetric', () => {
  let busFactorMetric: BusFactorMetric;
  let scorecard: Scorecard;

  beforeEach(() => {
    busFactorMetric = new BusFactorMetric();
    scorecard = {
      urlRepo: 'https://github.com/cs-450-project/se-phase1',
      busFactor: 0,
      busFactor_Latency: 0,
      url: '',
      netScore: 0,
      netScore_Latency: 0,
      rampUp: 0,
      rampUp_Latency: 0,
      correctness: 0,
      correctness_Latency: 0,
      responsiveMaintainer: 0,
      responsiveMaintainer_Latency: 0,
      license: 0,
      license_Latency: 0,
      calculateNetScore: function (): void {
        throw new Error('Function not implemented.');
      },
      getResults: function (): string {
        throw new Error('Function not implemented.');
      }
    };
  });

  it('should fetch contributors', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [{ login: 'contributor1' }, { login: 'contributor2' }] });

    const contributors = await busFactorMetric['getContributors'](scorecard.urlRepo, 'contributor');
    expect(contributors).toEqual(['contributor1', 'contributor2']);
  });

  it('should calculate bus factor', async () => {
    const contributors = ['contributor1', 'contributor2'];
    (axios.get as jest.Mock).mockResolvedValue({ data: [{ commit: {} }, { commit: {} }] });

    const busFactor = await busFactorMetric['calculateBusFactor'](scorecard.urlRepo, contributors);
    expect(busFactor).toBe(2);
  });

  it('should simulate latency', async () => {
    const latency = await busFactorMetric['simulateLatency']();
    expect(latency).toBe(100);
  });

  it('should evaluate bus factor and update scorecard', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [{ login: 'contributor1' }, { login: 'contributor2' }] });
    (axios.get as jest.Mock).mockResolvedValue({ data: [{ commit: {} }, { commit: {} }] });

    await busFactorMetric.evaluate(scorecard);
    expect(scorecard.busFactor).toBe(2);
    expect(scorecard.busFactor_Latency).toBe(100);
  });

  it('should handle errors during evaluation', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

    await busFactorMetric.evaluate(scorecard);
    expect(scorecard.busFactor).toBe(0);
    expect(scorecard.busFactor_Latency).toBe(0);
  });
});