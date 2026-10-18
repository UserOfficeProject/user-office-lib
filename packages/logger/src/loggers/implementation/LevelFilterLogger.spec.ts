import { LevelFilterLogger } from './LevelFilterLogger';
import { LEVEL } from '../../enum/Level';
import { Logger } from '../Logger';

describe('LevelFilterLogger', () => {
  let inner: jest.Mocked<Logger>;

  beforeEach(() => {
    inner = {
      logInfo: jest.fn(),
      logWarn: jest.fn(),
      logDebug: jest.fn(),
      logError: jest.fn(),
      logException: jest.fn(),
    };
  });

  const logAllLevels = (logger: Logger) => {
    logger.logDebug('debug', {});
    logger.logInfo('info', {});
    logger.logWarn('warn', {});
    logger.logError('error', {});
    logger.logException('exception', new Error('boom'), {});
  };

  test('forwards all messages when min level is DEBUG', () => {
    logAllLevels(new LevelFilterLogger(inner, LEVEL.DEBUG));

    expect(inner.logDebug).toHaveBeenCalledTimes(1);
    expect(inner.logInfo).toHaveBeenCalledTimes(1);
    expect(inner.logWarn).toHaveBeenCalledTimes(1);
    expect(inner.logError).toHaveBeenCalledTimes(1);
    expect(inner.logException).toHaveBeenCalledTimes(1);
  });

  test('drops messages below WARN when min level is WARN', () => {
    logAllLevels(new LevelFilterLogger(inner, LEVEL.WARN));

    expect(inner.logDebug).not.toHaveBeenCalled();
    expect(inner.logInfo).not.toHaveBeenCalled();
    expect(inner.logWarn).toHaveBeenCalledTimes(1);
    expect(inner.logError).toHaveBeenCalledTimes(1);
    expect(inner.logException).toHaveBeenCalledTimes(1);
  });

  test('forwards exceptions when min level is ERROR', () => {
    logAllLevels(new LevelFilterLogger(inner, LEVEL.ERROR));

    expect(inner.logWarn).not.toHaveBeenCalled();
    expect(inner.logError).toHaveBeenCalledTimes(1);
    expect(inner.logException).toHaveBeenCalledTimes(1);
  });

  test('drops everything when min level is FATAL', () => {
    logAllLevels(new LevelFilterLogger(inner, LEVEL.FATAL));

    expect(inner.logDebug).not.toHaveBeenCalled();
    expect(inner.logInfo).not.toHaveBeenCalled();
    expect(inner.logWarn).not.toHaveBeenCalled();
    expect(inner.logError).not.toHaveBeenCalled();
    expect(inner.logException).not.toHaveBeenCalled();
  });

  test('passes arguments through unchanged', () => {
    const logger = new LevelFilterLogger(inner, LEVEL.DEBUG);
    const context = { key: 'value' };
    const exception = new Error('boom');

    logger.logInfo('message', context);
    logger.logException('failed', exception, context);

    expect(inner.logInfo).toHaveBeenCalledWith('message', context);
    expect(inner.logException).toHaveBeenCalledWith(
      'failed',
      exception,
      context
    );
  });
});
