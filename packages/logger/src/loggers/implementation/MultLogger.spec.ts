import { MultiLogger } from './MultiLogger';
import { ConsoleLogger } from './ConsoleLogger';
beforeEach(() => {});

test('Should call all loggers', () => {
  const logger1 = new ConsoleLogger();
  const logger2 = new ConsoleLogger();

  const spy1 = jest.spyOn(logger1, 'logInfo');
  const spy2 = jest.spyOn(logger2, 'logInfo');

  const logger = new MultiLogger([logger1, logger2]);

  logger.logInfo('test', { test: true });

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);
});
