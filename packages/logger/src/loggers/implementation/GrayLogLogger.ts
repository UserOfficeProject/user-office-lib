import safeStringify from 'fast-safe-stringify';

import { LEVEL } from '../../enum/Level';
import { Logger } from '../Logger';

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
  log = require('gelf-pro');

  constructor(
    server: string,
    port: number,
    staticValues?: Record<string, unknown>,
    private contextToFieldProperties?: string[]
  ) {
    this.log.setConfig({
      fields: staticValues,
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
