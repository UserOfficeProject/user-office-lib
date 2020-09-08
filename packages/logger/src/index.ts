/*eslint @typescript-eslint/no-unused-vars: ["warn", { "argsIgnorePattern": "^_" }]*/
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

  private createPayload(level: LEVEL, message: string, context: object) {
    return {
      levelStr: LEVEL[level],
      title: message,
      environment: this.environment,
      stackTrace: new Error().stack,
      context: safeStringify(context),
    };
  }

  logInfo(message: string, context: object) {
    this.log.info(message, this.createPayload(LEVEL.INFO, message, context));
  }

  logWarn(message: string, context: object) {
    this.log.warning(message, this.createPayload(LEVEL.WARN, message, context));
  }

  logDebug(message: string, context: object) {
    this.log.debug(message, this.createPayload(LEVEL.DEBUG, message, context));
  }

  logError(message: string, context: object) {
    this.log.error(message, this.createPayload(LEVEL.ERROR, message, context));
  }

  logException(
    message: string,
    exception: Error | string,
    context?: object
  ): void {
    if (exception !== null) {
      this.logError(message, { exception, ...context });
    } else {
      this.logError(message, context || {});
    }
  }
}

class ConsoleLogger implements Logger {
  logInfo(message: string, context: object) {
    this.log(LEVEL.INFO, message, context);
  }

  logWarn(message: string, context: object) {
    this.log(LEVEL.WARN, message, context);
  }

  logDebug(message: string, context: object) {
    this.log(LEVEL.DEBUG, message, context);
  }

  logError(message: string, context: object) {
    this.log(LEVEL.ERROR, message, context);
  }

  logException(
    message: string,
    exception: Error | string,
    context?: object
  ): void {
    if (exception instanceof Error) {
      this.logError(
        message,
        (() => {
          const { name, message, stack } = exception;

          return {
            exception: { name, message, stack },
            levelStr: LEVEL[LEVEL.ERROR],
            ...context,
          };
        })()
      );
      if (typeof exception === 'string' || exception instanceof String) {
        this.logError(message, { exception, ...context });
      } else {
        this.logError(message, context || {});
      }
    }
  }

  log(level: LEVEL, message: string, context: object) {
    console.log(`${level} - ${message} \n ${safeStringify(context)}`);
  }
}

/* eslint-disable @typescript-eslint/no-empty-function */
export class MutedLogger implements Logger {
  logInfo(_message: string, _context: object): void {}
  logWarn(_message: string, _context: object): void {}
  logDebug(_message: string, _context: object): void {}
  logError(_message: string, _context: object): void {}
  logException(
    _message: string,
    _exception: Error | string,
    _context?: object
  ): void {}
}
/* eslint-enable @typescript-eslint/no-empty-function */

export interface Logger {
  logInfo(message: string, context: object): void;
  logWarn(message: string, context: object): void;
  logDebug(message: string, context: object): void;
  logError(message: string, context: object): void;
  logException(
    message: string,
    exception: Error | string,
    context?: object
  ): void;
}

class LoggerFactory {
  static logger: Logger;
  static getLogger(): Logger {
    if (this.logger) {
      return this.logger;
    }
    const env = process.env.NODE_ENV || 'unset';
    if (env === 'development') {
      this.logger = new ConsoleLogger();
      /*this.logger = new GrayLogLogger(
        process.env.GRAYLOG_SERVER!,
        parseInt(process.env.GRAYLOG_PORT!),
        process.env.NODE_ENV
      );*/
    } else {
      const server = process.env.GRAYLOG_SERVER;
      const port = parseInt(process.env.GRAYLOG_PORT || '0');
      if (server && port) {
        this.logger = new GrayLogLogger(server, port, env);
      } else {
        this.logger = new MutedLogger();
      }
    }

    return this.logger;
  }
}

const logger = LoggerFactory.getLogger();

export { logger, ConsoleLogger };
