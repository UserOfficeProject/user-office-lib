import { LEVEL } from '../../enum/Level';
import { Logger } from '../Logger';

const SEVERITY: Record<LEVEL, number> = {
  [LEVEL.DEBUG]: 0,
  [LEVEL.INFO]: 1,
  [LEVEL.WARN]: 2,
  [LEVEL.ERROR]: 3,
  [LEVEL.EXCEPTION]: 4,
  [LEVEL.FATAL]: 5,
};

/**
 * A logger that forwards to another logger only the messages
 * at or above the given minimum level.
 * Severity order: DEBUG < INFO < WARN < ERROR < EXCEPTION < FATAL
 */
export class LevelFilterLogger implements Logger {
  constructor(
    private logger: Logger,
    private minLevel: LEVEL
  ) {}

  private isEnabled(level: LEVEL) {
    return SEVERITY[level] >= SEVERITY[this.minLevel];
  }

  logInfo(message: string, context: Record<string, unknown>): void {
    if (this.isEnabled(LEVEL.INFO)) {
      this.logger.logInfo(message, context);
    }
  }
  logWarn(message: string, context: Record<string, unknown>): void {
    if (this.isEnabled(LEVEL.WARN)) {
      this.logger.logWarn(message, context);
    }
  }
  logDebug(message: string, context: Record<string, unknown>): void {
    if (this.isEnabled(LEVEL.DEBUG)) {
      this.logger.logDebug(message, context);
    }
  }
  logError(message: string, context: Record<string, unknown>): void {
    if (this.isEnabled(LEVEL.ERROR)) {
      this.logger.logError(message, context);
    }
  }
  logException(
    message: string,
    exception: unknown,
    context?: Record<string, unknown> | undefined
  ): void {
    if (this.isEnabled(LEVEL.EXCEPTION)) {
      this.logger.logException(message, exception, context);
    }
  }
}
