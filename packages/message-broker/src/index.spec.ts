jest.mock('amqplib');
jest.mock('@user-office-software/duo-logger');

import { RabbitMQMessageBroker, Queue } from './index';
import { logger } from '@user-office-software/duo-logger';
import amqp from 'amqplib';

describe('RabbitMQMessageBroker', () => {
  const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
  let broker: RabbitMQMessageBroker;
  let mockAmqpChannel: jest.Mocked<Partial<amqp.Channel>>;
  let mockAmqpConnection: jest.Mocked<Partial<amqp.Connection>>;
  let mockAmqpConnectionEventCallbacks: Map<string, Function> = new Map();
  let spyLogException: jest.SpyInstance;
  const TEST_EXCHANGE = 'user_office_backend.fanout';

  beforeEach(() => {
    mockAmqpChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: 'test-queue' }),
      assertExchange: jest.fn(),
      bindQueue: jest.fn(),
      publish: jest.fn(),
      consume: jest.fn().mockResolvedValue({}),
      on: jest.fn(),
    };

    mockAmqpConnection = {
      createChannel: jest.fn().mockResolvedValue(mockAmqpChannel),
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn().mockImplementation((event, cb) => {
        mockAmqpConnectionEventCallbacks.set(event, cb);
      }),
    };

    amqp.connect = jest.fn().mockResolvedValue(mockAmqpConnection);

    spyLogException = jest.spyOn(logger, 'logException');
  });

  describe('registerConsumers', () => {
    let consumer: jest.Mock;

    beforeEach(async () => {
      broker = new RabbitMQMessageBroker();
      consumer = jest.fn();
      await broker.setup();
    });

    it('should register a consumer when "listenOn" function is called', async () => {
      await broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);

      expect(mockAmqpChannel.consume).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        expect.any(Function),
        { noAck: false }
      );
    });

    it('should register multiple consumers when "listenOn" function is called multiple times', async () => {
      await broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);
      await broker.listenOn(Queue.SCICAT_PROPOSAL, consumer);
      await broker.listenOn(Queue.SCICAT_PROPOSAL, consumer);
      await broker.listenOn(Queue.SCICHAT_PROPOSAL, consumer);

      expect(mockAmqpChannel.consume).toHaveBeenCalledTimes(4);
    });

    it('should re-register consumers during reconnection', async () => {
      // register consumer
      await broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);

      // use fake timers to simulate 5sec timeout
      jest.useFakeTimers();

      // simulate connection close event
      mockAmqpConnectionEventCallbacks.get('close')!();

      // waiting for scheduleReconnect calls setup again
      jest.runAllTimers();
      jest.useRealTimers();

      // waiting for setup function to finish behind the scenes
      await sleep();

      expect(mockAmqpChannel.consume).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        expect.any(Function),
        { noAck: false }
      );

      expect(mockAmqpChannel.consume).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when registering consumers', async () => {
      mockAmqpChannel.consume = jest.fn().mockRejectedValue(new Error('test'));

      try {
        await broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);
      } catch (err) {
        expect((err as Error).message).toBe('test');
        expect(spyLogException).toHaveBeenCalledWith(
          'RabbitMQMessageBroker: Failed to register consumers',
          err
        );
      }

      // it should be able to register the consumer after an error (unregister the consumer)
      mockAmqpChannel.consume = jest.fn().mockResolvedValue({});
      await broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);
      expect(mockAmqpChannel.consume).toHaveBeenCalledTimes(2);
    });
  });

  describe('scheduleReconnect', () => {
    beforeEach(async () => {
      broker = new RabbitMQMessageBroker();
      await broker.setup();
    });

    it('should re-register consumers', async () => {
      // register consumer
      await broker.listenOn(Queue.SCHEDULING_PROPOSAL, jest.fn());

      // use fake timers to simulate 5sec timeout
      jest.useFakeTimers();

      // simulate connection close event
      mockAmqpConnectionEventCallbacks.get('close')!();

      // waiting for scheduleReconnect calls setup again
      jest.runAllTimers();
      jest.useRealTimers();

      // waiting for setup function to finish behind the scenes
      await sleep();

      expect(mockAmqpChannel.consume).toHaveBeenCalledTimes(2);
    });
  });

  describe('addQueueToExchangeBinding', () => {
    beforeEach(async () => {
      broker = new RabbitMQMessageBroker();
      await broker.setup();
    });

    it('should bind a queue to exchange when the function is called', async () => {
      await broker.addQueueToExchangeBinding(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE
      );

      expect(mockAmqpChannel.bindQueue).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE,
        ''
      );
    });

    it('should re-bind queues to exchanges during reconnection', async () => {
      // add queue to exchange binding
      await broker.addQueueToExchangeBinding(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE
      );

      // use fake timers to simulate 5sec timeout
      jest.useFakeTimers();

      // simulate connection close event
      mockAmqpConnectionEventCallbacks.get('close')!();

      // waiting for scheduleReconnect calls setup again
      jest.runAllTimers();
      jest.useRealTimers();

      // waiting for setup function to finish behind the scenes
      await sleep();

      expect(mockAmqpChannel.bindQueue).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE,
        ''
      );

      // it should be called 4 times because assertQueue also calls bindQueue for binding deadLetterQueue to deadLetterExchange
      expect(mockAmqpChannel.bindQueue).toHaveBeenCalledTimes(4);
    });
  });
});
