declare module 'gelf-pro' {
  function info(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function warning(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function debug(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
  function error(
    message: Message,
    extra?: MessageExtra,
    callback?: MessageCallback
  ): void;
}
