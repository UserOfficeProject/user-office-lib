# User Office shared libraries

## Adding new packages

To create a new package, you can copy and rename the `.templates/new-package` to `packages` folder.

```bash
$ cp -r ./.templates/new-package/ ./packages/__PACKAGE_NAME__
```

Then you have to update the `name` field `package.json`.

```json
"name": "@esss-swap/",      ->      "name": "@esss-swap/__PACKAGE_NAME__",
```

If you need additional configuration you feel free to do so.

In the next step you have to update the `paths` property in the root `tsconfig.json` with the new package:

```json
    "paths": {
      "@esss-swap/duo-logger": ["logger/src"],
      "@esss-swap/duo-localisation": ["localisation/src"],
      "@esss-swap/__PACKAGE_NAME__": ["__PACKAGE_NAME__/src"],
    }
```

## Adding dependencies

If your package has external dependencies (usually it does) you can do so by using Lerna (only one package can be added per command):

### Adding new dependency for every package:

```bash
$ lerna add <package>[@version] [--dev] [--exact] [--peer]
```

### Adding new dependency for a selected package:

```bash
$ lerna add <package> packages/__PACKAGE_NAME__
```

> More details information on Lerna's page: https://github.com/lerna/lerna/tree/master/commands/add

## Publishing new version

Before publishing new version it's recommended to run `npm run lerna:prePublish` in order to update package-lock.json with the new version number.
By default in case of a new push to the `master` branch a Github action will be triggered, which will check if there are any updated packages - updated means it has a version number which does not exist in NPM registry. If there are it will publish the new packages. \
Every package should have a `build` command which compiles TS to JS using a proper tsconfig.

## Useful NPM scripts

```bash
# Installs the packages' dependencies and links local packages
$ npm run lerna:bootstrap

# Runs the `build` script in every package which contains this script in its `package.json`
$ npm run lerna:build

# Runs the `test` script in every package which contains this script in its `package.json`
$ npm run lerna:test

# Removes the `node_modules` folders from all packages
# Runs the `clean` script in every package which contains this script in its `package.json`
$ npm run clean

# Runs `npm run clean` to remove node_modules and built files
# Runs `npm run lerna:bootstrap` to install the dependencies and to update `package-lock.json`
# Runs `npm run lerna:build` just to make sure everything still works properly
$ npm run lerna:prePublish
```
