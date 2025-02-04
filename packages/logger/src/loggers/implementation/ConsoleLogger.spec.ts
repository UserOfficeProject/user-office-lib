import safeStringify from 'fast-safe-stringify';
import { ConsoleLogger } from './ConsoleLogger';
import { LEVEL } from '../../enum/Level';

describe('ConsoleLogger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('logs info message without color when colorize is false', () => {
    const logger = new ConsoleLogger(); // default config, colorize false
    const context = { key: 'TestValue' };
    const message = 'Test info message';
    logger.logInfo(message, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain(LEVEL.INFO);
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs warn message with color when colorize is true', () => {
    const logger = new ConsoleLogger({ colorize: true });
    const context = { key: 'TestValue' };
    const message = 'Test warn message';
    logger.logWarn(message, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    const expectedLevel = `\x1b[33m${LEVEL.WARN}\x1b[0m`; // yellow for WARN
    expect(loggedMessage).toContain(expectedLevel);
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs error message with color when colorize is true', () => {
    const logger = new ConsoleLogger({ colorize: true });
    const context = { key: 'TestValue' };
    const message = 'Test error message';
    logger.logError(message, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    const expectedLevel = `\x1b[31m${LEVEL.ERROR}\x1b[0m`; // red for ERROR
    expect(loggedMessage).toContain(expectedLevel);
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs debug message without color even when colorize is true', () => {
    const logger = new ConsoleLogger({ colorize: true });
    const context = { key: 'TestValue' };
    const message = 'Test debug message';
    logger.logDebug(message, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    // DEBUG messages are not colorized
    expect(loggedMessage).toContain(LEVEL.DEBUG);
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs exception details when an Error instance is passed', () => {
    const logger = new ConsoleLogger({ colorize: false });
    const error = new Error('Something went wrong');
    const message = 'Exception occurred';
    const context = { key: 'TestValue' };

    logger.logException(message, error, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain(error.message);
    expect(loggedMessage).toContain('stack');
    // because the context is merged, safeStringify(context) should be present
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs exception when a non-Error value is passed', () => {
    const logger = new ConsoleLogger({ colorize: false });
    const notError = 'simple string exception';
    const message = 'Exception occurred';
    const context = { key: 'TestValue' };

    logger.logException(message, notError, context);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toContain(message);
    expect(loggedMessage).toContain(notError);
    expect(loggedMessage).toContain('TestValue');
  });

  test('logs exception correctly when exception is null', () => {
    const logger = new ConsoleLogger({ colorize: false });
    const message = 'Null exception test';

    logger.logException(message, null);

    expect(consoleSpy).toHaveBeenCalled();
    const loggedMessage = consoleSpy.mock.calls[0][0];
    expect(loggedMessage).toContain(message);
  });
});
