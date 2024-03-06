import safeStringify from 'fast-safe-stringify';
import logger, { MessageCallback } from 'gelf-pro';

import { LEVEL } from '../../enum/Level';
import { Logger } from '../Logger';

declare module 'gelf-pro' {
  function info(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function warning(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function debug(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function error(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
}

function extractPropertiesFromJson(
  json: Record<string, unknown>,
  properties: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const property of properties) {
    const value = json[property];
    if (value !== undefined) {
      result[property] = value;
    }
  }

  return result;
}

export class GrayLogLogger implements Logger {
  log = logger;
  errorCb: MessageCallback | undefined;

  constructor(
    server: string,
    port: number,
    staticValues?: Record<string, unknown>,
    private contextToFieldProperties?: string[],
    errorCb?: MessageCallback
  ) {
    this.log.setConfig({
      fields: staticValues,
      adapterName: 'udp',
      adapterOptions: {
        host: server,
        port: port,
      },
    });

    this.errorCb = errorCb || this.errorDefaultCb;
  }

  private errorDefaultCb: MessageCallback = (error) => {
    if (error?.message) {
      console.error(error);
    }
  };

  private createPayload(
    level: LEVEL,
    message: string,
    context: Record<string, unknown>
  ) {
    const fieldProperties = extractPropertiesFromJson(
      context,
      this.contextToFieldProperties || []
    );

    return {
      levelStr: LEVEL[level],
      title: message,
      stackTrace: new Error().stack,
      context: safeStringify(context),
      ...fieldProperties,
    };
  }

  logInfo(message: string, context: Record<string, unknown>) {
    this.log.info(
      message,
      this.createPayload(LEVEL.INFO, message, context),
      this.errorCb
    );
  }

  logWarn(message: string, context: Record<string, unknown>) {
    this.log.warning(
      message,
      this.createPayload(LEVEL.WARN, message, context),
      this.errorCb
    );
  }

  logDebug(message: string, context: Record<string, unknown>) {
    this.log.debug(
      message,
      this.createPayload(LEVEL.DEBUG, message, context),
      this.errorCb
    );
  }

  logError(message: string, context: Record<string, unknown>) {
    this.log.error(
      message,
      this.createPayload(LEVEL.ERROR, message, context),
      this.errorCb
    );
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
