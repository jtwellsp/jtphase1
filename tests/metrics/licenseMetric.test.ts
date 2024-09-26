// tests/metrics/licenseMetric.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { LicenseMetric } from '../../src/models/metrics/licenseMetric';
import { Scorecard } from '../../src/models/scores/scorecard';

// Mock the logger
vi.mock('../../src/logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock dotenv
vi.mock('dotenv', () => {
    return {
      default: {
        config: vi.fn(),
      },
    };
  });  

// Mock the Octokit module
vi.mock('@octokit/rest', () => {
  const Octokit = vi.fn();
  return { Octokit };
});

// Import the mocked modules
import logger from '../../src/logger.js';
import { Octokit } from '@octokit/rest';

describe('LicenseMetric', () => {
  let licenseMetric: LicenseMetric;
  let octokitMock: {
    repos: {
      get: Mock;
      getReadme: Mock;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock methods for repos.get and repos.getReadme
    octokitMock = {
      repos: {
        get: vi.fn(),
        getReadme: vi.fn(),
      },
    };

    // Mock the Octokit constructor to return our mock
    (Octokit as unknown as Mock).mockImplementation(() => octokitMock);

    // Instantiate LicenseMetric (it will use the mocked Octokit)
    licenseMetric = new LicenseMetric();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set license score to 1 if approved license is found in LICENSE file', async () => {
    const card = new Scorecard('https://github.com/owner/repo');

    // Mock the response from octokit.repos.get
    octokitMock.repos.get.mockResolvedValueOnce({
      data: {
        license: {
          spdx_id: 'MIT',
        },
      },
    });

    await licenseMetric.evaluate(card);

    expect(card.license).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Approved license found: MIT');
  });

  it('should set license score to 0 if unapproved license is found in LICENSE file', async () => {
    const card = new Scorecard('https://github.com/owner/repo');

    // Mock the response with an unapproved license
    octokitMock.repos.get.mockResolvedValueOnce({
      data: {
        license: {
          spdx_id: 'Unapproved-License',
        },
      },
    });

    await licenseMetric.evaluate(card);

    expect(card.license).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith('Unapproved license: Unapproved-License');
  });

  it('should check README if no license is found in LICENSE file and set score accordingly', async () => {
    const card = new Scorecard('https://github.com/owner/repo');

    // Mock the response with no license in LICENSE file
    octokitMock.repos.get.mockResolvedValueOnce({
      data: {
        license: null,
      },
    });

    // Mock the README content containing an approved license
    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: Buffer.from('This project is licensed under the MIT License.').toString('base64'),
      },
    });

    await licenseMetric.evaluate(card);

    expect(card.license).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Approved license found in README.');
  });

  it('should set license score to 0 if no approved license is found anywhere', async () => {
    const card = new Scorecard('https://github.com/owner/repo');

    // Mock the response with no license in LICENSE file
    octokitMock.repos.get.mockResolvedValueOnce({
      data: {
        license: null,
      },
    });

    // Mock the README content without an approved license
    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: Buffer.from('No license information here.').toString('base64'),
      },
    });

    await licenseMetric.evaluate(card);

    expect(card.license).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith('No approved license found in README.');
  });

  it('should handle errors from GitHub API and set license score to 0', async () => {
    const card = new Scorecard('https://github.com/owner/repo');

    // Mock an error from the GitHub API
    octokitMock.repos.get.mockRejectedValueOnce(new Error('API Error'));

    await licenseMetric.evaluate(card);

    expect(card.license).toBe(0);
    expect(card.license_Latency).toBe(0);
    expect(logger.error).toHaveBeenCalledWith('Error fetching license information:', new Error('API Error'));
  });
});
