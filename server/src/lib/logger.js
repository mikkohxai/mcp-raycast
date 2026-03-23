import { config } from "../config.js";

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

function log(level, ...args) {
  if (LEVELS[level] >= LEVELS[config.logLevel]) {
    console.error(`[${level.toUpperCase()}]`, ...args);
  }
}

export const logger = {
  debug: (...args) => log("debug", ...args),
  info: (...args) => log("info", ...args),
  warn: (...args) => log("warn", ...args),
  error: (...args) => log("error", ...args),
};
