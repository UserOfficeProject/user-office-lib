import safeStringify from 'fast-safe-stringify';

import { LEVEL } from '../../enum/Level';
import { Logger } from '../Logger';

export class ConsoleLogger implements Logger {
  private readonly colorize: boolean;

  constructor(config: { colorize: boolean } = { colorize: false }) {
    this.colorize = config.colorize;
  }

  logInfo(message: string, context: Record<string, unknown>) {
    this.log(LEVEL.INFO, message, context);
  }

  logWarn(message: string, context: Record<string, unknown>) {
    this.log(LEVEL.WARN, message, context);
  }

  logDebug(message: string, context: Record<string, unknown>) {
    this.log(LEVEL.DEBUG, message, context);
  }

  logError(message: string, context: Record<string, unknown>) {
    this.log(LEVEL.ERROR, message, context);
  }

  /**
   *  Logs an exception
   * @param message  The message to log
   * @param exception  The exception to log
   * @param context  The context to log
   */
  logException(
    message: string,
    exception: unknown,
    context?: Record<string, unknown>
  ): void {
    if (exception instanceof Error) {
      // explicitly extract the properties and pass them on
      // so when the error is stringified they show up properly
      const { name, message: msg, stack } = exception;
      this.logError(message, {
        exception: { name, message: msg, stack },
        ...context,
      });
    } else if (exception !== null) {
      this.logError(message, { exception, ...context });
    } else {
      this.logError(message, context || {});
    }
  }

  log(level: LEVEL, message: string, context: Record<string, unknown>) {
    // Color definitions
    const colorReset = '\x1b[0m';
    const colorRed = '\x1b[31m';
    const colorYellow = '\x1b[33m';
    const colorBold = '\x1b[1m';

    let formattedLevel: string = level;
    if (this.colorize) {
      switch (level) {
        case LEVEL.INFO:
          formattedLevel = `${colorBold}${level}${colorReset}`;
          break;
        case LEVEL.ERROR:
          formattedLevel = `${colorRed}${level}${colorReset}`;
          break;
        case LEVEL.WARN:
          formattedLevel = `${colorYellow}${level}${colorReset}`;
          break;
      }
    }
    // If not colorized, use plain level text

    console.log(
      `[${new Date().toISOString()}] ${formattedLevel} - ${message} \n ${safeStringify(
        context
      )}`
    );
  }
}
