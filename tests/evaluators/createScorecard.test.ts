import { describe, it, expect, vi, Mock } from 'vitest';
import { createScorecard } from '../../src/models/evaluators/createScorecard';
import { Scorecard } from '../../src/models/scores/scorecard';
import logger from '../../src/logger';

vi.mock('../../src/logger');
vi.mock('../../src/models/scores/scorecard');

describe('createScorecard', () => {
  it('should create a Scorecard for a GitHub URL', async () => {
    const url = 'https://github.com/owner/repo';
    const scorecard = new Scorecard(url);
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';

    // Mock the Scorecard constructor to return the expected scorecard instance
    (Scorecard as Mock).mockImplementation(() => scorecard);

    const result = await createScorecard(url);

    console.log(result.owner);
    console.log(result.repo);

    expect(result).toEqual(scorecard);
    expect(logger.info).toHaveBeenCalledWith(`Creating scorecard for URL: ${url}`);
    expect(logger.info).toHaveBeenCalledWith(`Detected GitHub URL: ${url}`);
    expect(logger.info).toHaveBeenCalledWith(`Owner: owner`);
    expect(logger.info).toHaveBeenCalledWith(`Repo: repo`);
  });

  it('should create a Scorecard for an npm URL', async () => {
    const url = 'https://www.npmjs.com/package/module';
    const repoUrl = 'https://github.com/owner/repo';
    const scorecard = new Scorecard(url);
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        repository: { url: repoUrl }
      })
    });

    const result = await createScorecard(url);

    expect(result).toEqual(scorecard);
    expect(logger.info).toHaveBeenCalledWith(`Creating scorecard for URL: ${url}`);
    expect(logger.info).toHaveBeenCalledWith(`Detected npm URL: ${url}`);
    expect(logger.info).toHaveBeenCalledWith(`Fetching repository URL from npm API: https://replicate.npmjs.com/module`);
    expect(logger.info).toHaveBeenCalledWith(`NPM Repository URL: ${repoUrl}`);
    expect(logger.info).toHaveBeenCalledWith(`Owner: owner`);
    expect(logger.info).toHaveBeenCalledWith(`Repo: repo`);
  });

  it('should throw an error for an invalid URL', async () => {
    const url = 'https://invalid.com/package/module';

    await expect(createScorecard(url)).rejects.toThrow('Invalid URL');
    expect(logger.error).toHaveBeenCalledWith(`Invalid URL: ${url}`);
  });
});