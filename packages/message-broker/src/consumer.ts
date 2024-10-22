import { ConsumerCallback } from './index';

// This class is used to store the callback function and whether it is registered or not.
export class Consumer {
  callback: ConsumerCallback;
  registered: boolean;

  constructor(callback: ConsumerCallback) {
    this.callback = callback;
    this.registered = false;
  }

  register() {
    this.registered = true;
  }

  unregister() {
    this.registered = false;
  }

  isRegistered() {
    return this.registered;
  }
}
