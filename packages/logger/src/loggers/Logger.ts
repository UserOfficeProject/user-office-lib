export interface Logger {
  logInfo(message: string, context: Record<string, unknown>): void;
  logWarn(message: string, context: Record<string, unknown>): void;
  logDebug(message: string, context: Record<string, unknown>): void;
  logError(message: string, context: Record<string, unknown>): void;
  logException(
    message: string,
    exception: unknown,
    context?: Record<string, unknown>
  ): void;
}
