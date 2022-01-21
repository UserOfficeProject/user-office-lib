import { ConsoleLogger } from './loggers/implementation/ConsoleLogger';
import { Logger } from './loggers/Logger';

const deaultLogger = new ConsoleLogger();
let logger: Logger = deaultLogger;

function setLogger(newLogger: Logger) {
  logger = newLogger;
}

export { logger, setLogger };
