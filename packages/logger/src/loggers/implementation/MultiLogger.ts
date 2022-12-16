import { Logger } from '../Logger';

/**
 * A logger that forwards all messages to multiple other loggers.
 */
export class MultiLogger implements Logger {
  constructor(private loggers: Logger[]) {}

  private callLoggers(method: keyof Logger, ...args: unknown[]) {
    for (const logger of this.loggers) {
      // eslint-disable-next-line @typescript-eslint/ban-types -- We need to call the method dynamically
      (logger[method] as Function)(...args);
    }
  }

  logInfo(message: string, context: Record<string, unknown>): void {
    this.callLoggers('logInfo', message, context);
  }
  logWarn(message: string, context: Record<string, unknown>): void {
    this.callLoggers('logWarn', message, context);
  }
  logDebug(message: string, context: Record<string, unknown>): void {
    this.callLoggers('logDebug', message, context);
  }
  logError(message: string, context: Record<string, unknown>): void {
    this.callLoggers('logError', message, context);
  }
  logException(
    message: string,
    exception: unknown,
    context?: Record<string, unknown> | undefined
  ): void {
    this.callLoggers('logException', message, exception, context);
  }
}
