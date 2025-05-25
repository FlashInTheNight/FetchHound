/* eslint-disable no-undef */
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[Extension]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error('[Extension Error]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[Extension Warning]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[Extension Info]', ...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[Extension Debug]', ...args);
    }
  },
};
