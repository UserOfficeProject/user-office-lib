import safeStringify from 'fast-safe-stringify';

export enum LEVEL {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
  EXCEPTION = 'EXCEPTION',
  FATAL = 'FATAL',
}

class GrayLogLogger implements Logger {
  log = require('gelf-pro');

  constructor(
    server: string,
    port: number,
    private environment: string,
    options?: { facility: string; service: string }
  ) {
    this.log.setConfig({
      fields: {
        facility: options?.facility || 'DMSC',
        service: options?.service || 'UserOfficeBackend',
      },
      adapterName: 'udp',
      adapterOptions: {
        host: server,
        port: port,
      },
    });
  }

  private createPayload(
    level: LEVEL,
    message: string,
    context: Record<string, unknown>
  ) {
    return {
      levelStr: LEVEL[level],
      title: message,
      environment: this.environment,
      stackTrace: new Error().stack,
      context: safeStringify(context),
    };
  }

  logInfo(message: string, context: Record<string, unknown>) {
    this.log.info(message, this.createPayload(LEVEL.INFO, message, context));
  }

  logWarn(message: string, context: Record<string, unknown>) {
    this.log.warning(message, this.createPayload(LEVEL.WARN, message, context));
  }

  logDebug(message: string, context: Record<string, unknown>) {
    this.log.debug(message, this.createPayload(LEVEL.DEBUG, message, context));
  }

  logError(message: string, context: Record<string, unknown>) {
    this.log.error(message, this.createPayload(LEVEL.ERROR, message, context));
  }

  logException(
    message: string,
    exception: Error | string,
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

class ConsoleLogger implements Logger {
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

  logException(
    message: string,
    exception: Error | string,
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
    console.log(
      `[${new Date().toISOString()}] ${level} - ${message} \n ${safeStringify(
        context
      )}`
    );
  }
}

export interface Logger {
  logInfo(message: string, context: Record<string, unknown>): void;
  logWarn(message: string, context: Record<string, unknown>): void;
  logDebug(message: string, context: Record<string, unknown>): void;
  logError(message: string, context: Record<string, unknown>): void;
  logException(
    message: string,
    exception: Error | string | unknown,
    context?: Record<string, unknown>
  ): void;
}

class LoggerFactory {
  static logger: Logger;
  static getLogger(): Logger {
    if (this.logger) {
      return this.logger;
    }

    const server = process.env.GRAYLOG_SERVER;
    const port = process.env.GRAYLOG_PORT;

    if (server && port) {
      const env = process.env.NODE_ENV || 'unset';
      this.logger = new GrayLogLogger(server, parseInt(port), env);
    } else {
      this.logger = new ConsoleLogger();
    }

    return this.logger;
  }
}

const logger = LoggerFactory.getLogger();

export { logger, ConsoleLogger };
