import { logger } from '@esss-swap/duo-logger';
import amqp, { Connection, Channel, MessageProperties, Options } from 'amqplib';

type Message = {
  queue: Queue;
  type: string;
  msg: string;
};

export enum Queue {
  PROPOSAL = 'PROPOSAL',
}

export type ConsumerCallback = (
  type: string,
  message: Record<string, unknown>,
  properties: MessageProperties
) => Promise<void>;

export interface MessageBroker {
  sendMessage(queue: Queue, type: string, message: string): Promise<void>;
  listenOn(queue: Queue, cb: ConsumerCallback): void;
}

export class RabbitMQMessageBroker implements MessageBroker {
  private connectionConfig: string | Options.Connect = 'amqp://localhost';
  private socketOptions: any;

  private consumers: Array<[Queue, ConsumerCallback]> = [];
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private messageBuffer: Message[] = [];

  listenOn(queue: Queue, cb: ConsumerCallback) {
    this.consumers.push([queue, cb]);

    if (this.channel) {
      this.registerConsumers();
    }
  }

  async sendMessage(queue: Queue, type: string, msg: string) {
    if (!this.channel) {
      logger.logWarn('Channel is not available', { queue, type, msg });

      this.messageBuffer.push({ queue, type, msg });

      return;
    }

    try {
      await this.assertQueue(queue);
      const writeable = this.channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true,
        timestamp: Date.now(),
        type: type,
      });

      // queue up messages and listen for `drain` event
      if (!writeable) {
        this.messageBuffer.push({ queue, type, msg });
      }
    } catch (err) {
      logger.logException('sending message failed at some point', err, {
        queue,
        type,
        msg,
      });
    }
  }

  async setup(
    connectionConfig?: string | Options.Connect,
    socketOptions?: any
  ) {
    this.connectionConfig = connectionConfig || this.connectionConfig;
    this.socketOptions = socketOptions;

    try {
      logger.logInfo('RabbitMQMessageBroker: Connecting...', {});

      this.connection = await amqp.connect(
        this.connectionConfig,
        this.socketOptions
      );

      logger.logInfo('RabbitMQMessageBroker: Connected', {});

      this.connection.on('error', (err) => {
        logger.logException('RabbitMQMessageBroker: Connection error', err);
      });

      this.connection.on('close', () => {
        logger.logWarn('RabbitMQMessageBroker: Connection closed', {});
        this.connection = null;
        this.channel = null;

        this.scheduleReconnect();
      });

      await this.registerChannel();

      await this.registerConsumers();

      logger.logInfo('RabbitMQMessageBroker: Setup finished', {});
    } catch (e) {
      logger.logException('RabbitMQMessageBroker: Setup failed:', e.message);

      // if we already have a connection but failed to register channel
      // close the channel and restart the process
      if (this.connection) {
        await this.connection
          .close()
          .catch((e) =>
            logger.logException(
              'RabbitMQMessageBroker: failed to close connection in try-catch',
              e
            )
          );
        this.connection = null;
      }

      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    logger.logInfo(
      'RabbitMQMessageBroker: Trying to reconnecting after 5 sec',
      {}
    );

    setTimeout(() => this.setup(), 5000);
  }

  private async registerChannel() {
    if (!this.connection || this.channel) {
      return;
    }

    logger.logInfo('RabbitMQMessageBroker: Creating channel...', {});

    this.channel = await this.connection.createChannel();

    logger.logInfo('RabbitMQMessageBroker: Channel created', {});

    this.channel.on('drain', () => {
      this.flushMessages();
    });

    this.channel.on('error', (err) => {
      logger.logException('RabbitMQMessageBroker: Channel error', err);
    });

    this.channel.on('close', () => {
      logger.logWarn('RabbitMQMessageBroker: Channel closed', {});
      this.channel = null;

      this.scheduleChannelCreation();
    });

    // after (re)creating a channel try to flush every buffered messages
    this.flushMessages();
  }

  private scheduleChannelCreation() {
    logger.logInfo(
      'RabbitMQMessageBroker: Trying to recreate a channel after 5 sec',
      {}
    );

    setTimeout(() => this.registerChannel(), 5000);
  }

  private async registerConsumers() {
    if (!this.channel) {
      return;
    }

    try {
      logger.logInfo(
        `RabbitMQMessageBroker: Registering consumers (${this.consumers.length})`,
        {}
      );

      const consumers = this.consumers;
      this.consumers = [];

      for (const [queue, cb] of consumers) {
        await this.assertQueue(queue);

        await this.channel.consume(
          queue,
          (msg) => {
            // is this even possible???
            if (!msg) {
              return;
            }

            const stringifiedContent = msg.content.toString();
            let content: Record<string, unknown> = {};

            try {
              content = JSON.parse(stringifiedContent);
            } catch (err) {
              logger.logException(
                'RabbitMQMessageBroker: Failed to parse the message content',
                err,
                { content: stringifiedContent }
              );

              this.channel?.nack(msg, false, false);

              return;
            }

            cb(msg.properties.type, content, msg.properties)
              .then(() => {
                /**
                 * NOTE:
                 * `this.ch` can be null when something goes down while processing an event.
                 * If a channel with not acknowledged message is closed
                 * the event gets back to the queue.
                 * Even if we establish a channel while processing the event
                 * RabbitMQ won't accept the ack request
                 *
                 * See: https://www.rabbitmq.com/confirms.html
                 * Acknowledgement must be sent on the same channel that received the delivery.
                 * Attempts to acknowledge using a different channel will result in a channel-level
                 * protocol exception. See the doc guide on confirmations to learn more.
                 *
                 * TODO: maybe try to handle it gracefully and handle duplicate
                 * event processing in the listener
                 *
                 */
                this.channel?.ack(msg);
              })
              .catch((err) => {
                logger.logException(
                  `RabbitMQMessageBroker: Registered consumer failed (${queue})`,
                  err,
                  { ...msg, content }
                );
                /***
                 * Same situation we have above
                 * TODO: maybe try handle gracefully
                 *
                 * NOTE: not acknowledged events go to a dead letter queue
                 */
                this.channel?.nack(msg, false, false);
              });
          },
          { noAck: false }
        );
      }

      logger.logInfo('RabbitMQMessageBroker: Consumers registered', {});
    } catch (err) {
      logger.logException(
        'RabbitMQMessageBroker: Failed to register consumer',
        err
      );
    }
  }

  private async assertQueue(queue: Queue) {
    if (!this.channel) {
      return;
    }

    const deadLetterQueue = `DL__${queue}`;
    const deadLetterExchange = `DLX__${queue}`;

    await this.channel.assertExchange(deadLetterExchange, 'fanout', {
      durable: true,
    });
    await this.channel.assertQueue(deadLetterQueue, { durable: true });
    await this.channel.bindQueue(deadLetterQueue, deadLetterExchange, '');
    await this.channel.assertQueue(queue, {
      deadLetterExchange: deadLetterExchange,
      durable: true,
    });
  }

  private flushMessages() {
    if (this.messageBuffer.length === 0) {
      return;
    }

    logger.logInfo(
      `RabbitMQMessageBroker: flushMessage triggered, buffered messages: ${this.messageBuffer.length}`,
      {}
    );

    const messageBuffer = this.messageBuffer;
    this.messageBuffer = [];

    messageBuffer.forEach(({ queue, type, msg }) => {
      this.sendMessage(queue, type, msg);
    });
  }
}
