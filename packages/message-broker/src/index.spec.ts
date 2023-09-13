jest.mock('amqplib');
jest.mock('@user-office-software/duo-logger');

import { RabbitMQMessageBroker, Queue } from './index';
import amqp from 'amqplib';

describe('RabbitMQMessageBroker', () => {
  const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
  let broker: RabbitMQMessageBroker;
  let mockAmqpChannel: jest.Mocked<Partial<amqp.Channel>>;
  let mockAmqpConnection: jest.Mocked<Partial<amqp.Connection>>;
  let mockAmqpConnectionEventCallbacks: Map<string, Function> = new Map();
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

    broker = new RabbitMQMessageBroker();
  });

  describe('registerConsumers', () => {
    let consumer: jest.Mock;

    beforeEach(async () => {
      consumer = jest.fn();
      await broker.setup();
    });

    it('should register a consumer when "listenOn" function is called', async () => {
      broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);

      // waiting for registerConsumer function to finish behind the scenes
      await sleep();

      expect(mockAmqpChannel.consume).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        expect.any(Function),
        { noAck: false }
      );
    });

    it('should re-register consumers during reconnection', async () => {
      // register consumer
      broker.listenOn(Queue.SCHEDULING_PROPOSAL, consumer);

      // waiting for registerConsumer function to finish behind the scenes
      await sleep();

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

    it('should bind a queue to exchange when "addQueueToExchangeBinding" function is called', async () => {
      broker.addQueueToExchangeBinding(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE
      );

      // waiting for addQueueToExchangeBinding function to finish behind the scenes
      await sleep();

      expect(mockAmqpChannel.bindQueue).toHaveBeenCalledWith(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE,
        ''
      );
    });

    it('should re-bind queues to exchanges during reconnection', async () => {
      // add queue to exchange binding
      broker.addQueueToExchangeBinding(
        Queue.SCHEDULING_PROPOSAL,
        TEST_EXCHANGE
      );

      // waiting for registerConsumer function to finish behind the scenes
      await sleep();

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
