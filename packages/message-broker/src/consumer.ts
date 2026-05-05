import { ConsumerCallback, ListenOnOptions } from './index';

// This class is used to store the callback function and whether it is registered or not.
export class Consumer {
  callback: ConsumerCallback;
  registered: boolean;
  options: ListenOnOptions;

  constructor(callback: ConsumerCallback, options: ListenOnOptions = {}) {
    this.callback = callback;
    this.registered = false;
    this.options = options;
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
