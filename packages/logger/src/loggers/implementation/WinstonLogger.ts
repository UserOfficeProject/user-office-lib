import Winston, { createLogger } from 'winston';

import { Logger } from '../Logger';

class WinstonLogger implements Logger {
  log: Winston.Logger;

  constructor(options?: Winston.LoggerOptions) {
    this.log = createLogger({
      level: 'info',
      format: Winston.format.json(),
      transports: [new Winston.transports.Console()],
      ...options,
    });
  }

  logInfo(message: string, context: Record<string, unknown>) {
    this.log.info(message, context);
  }
  logWarn(message: string, context: Record<string, unknown>) {
    this.log.warn(message, context);
  }

  logDebug(message: string, context: Record<string, unknown>) {
    this.log.debug(message, context);
  }

  logError(message: string, context: Record<string, unknown>) {
    this.log.error(message, context);
  }

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
}
export { Winston, WinstonLogger };
