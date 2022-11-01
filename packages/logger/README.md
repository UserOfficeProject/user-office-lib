# duo-logger

duo-logger is a standalone NPM library developed for [UserOfficeSoftware](https://github.com/UserOfficeProject) that provides simple and common interface for sending logs.
Library is integrated with several applications and is configurable with variety of logging services.
Comes with these out of the box implementations:
- Console Logger
- GrayLog
- Mute Logger

## Installation

Use the package manager [npm](https://www.npmjs.com/package/@user-office-software/duo-validation) to install duo-logger.

```bash
npm install @user-office-software/duo-validation
```

## Usage

Example for setting up console logger
```typescript
import { ConsoleLogger, setLogger } from '@user-office-software/duo-logger';

// set ConsoleLogger as your logging service
setLogger(new ConsoleLogger());
```

Example for setting up Graylog logger
```typescript
setLogger(
  new GrayLogLogger(
    'my-graylog-server.com',
    12201,
    { environment: 'develop', service: 'my-service' },
    []
  )
);
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
