import { ConsoleLogger } from './loggers/implementation/ConsoleLogger';
import { MultiLogger } from './loggers/implementation/MultiLogger';
import { Logger } from './loggers/Logger';

const deaultLogger = new ConsoleLogger();
let logger: Logger = deaultLogger;

function setLogger(newLogger: Logger | Logger[]) {
  if (Array.isArray(newLogger)) {
    logger = new MultiLogger(newLogger);
  } else {
    logger = newLogger;
  }
}

export { logger, setLogger };
