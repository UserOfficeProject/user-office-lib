## Description

Contains resources for localising UO project NB. Currently only British English is supported

## Installing

Install package as normal

```bash
npm install @user-office-software/duo-localisation
```

## Publishing

After changes, make sure to bump version in package.json \
Add a tag `git tag -a v<x.x.x>` and push your changes to repository\
New version will be published by gitlab in npm registry\
Check progress of deployment here: https://gitlab.esss.lu.se/swap/duo-packages/duo-localisation/pipelines

## Updating

After publishing you can update project that depend on this package by running

```bash
npm update @user-office-software/duo-localisation
```
