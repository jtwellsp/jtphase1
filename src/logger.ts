// logger.ts

import { pino } from 'pino';
import fs from 'fs';

import dotevn from 'dotenv';
dotevn.config();


// Log levels based on project requirements
const logLevels = ['silent', 'info', 'debug', 'error']

const level: string = process.env.LOG_LEVEL ? logLevels[parseInt(process.env.LOG_LEVEL)] : 'info';

const logger = pino({
  level: level,
  transport: {
    target: 'pino-pretty', // Pretty-print logs during development
    options: {
      colorize: true,       // Colorize logs for readability
    },
  },
});

export default logger;
