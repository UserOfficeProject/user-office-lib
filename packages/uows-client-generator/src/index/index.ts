#!/usr/bin/env node

import * as fs from 'fs';

import * as soap from 'soap';
import * as yargs from 'yargs';

import {
  constructorTemplate,
  makeArgsObjTemplate,
} from '../construct-functions/constructFunctions';
import { populateFuncts } from '../create-service-description/createServiceDescription';

let wsdlDesc: any;

//Gets the arguments provided by the user
const getArgs = () => {
  return yargs.options({
    wsdl: {
      alias: 'w',
      type: 'string',
      demandOption: false,
      default: 'https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl',
      description: 'URL or path pointing to WSDL you wish to use',
    },
    outputPath: {
      alias: 'o',
      type: 'string',
      demandOption: false,
      default: './UOWSSoapInterface.ts',
      description: 'Output path of file defining client interface',
    },
  }).argv;
};

//Writes the UOWSSoapInterface.ts file to storage
const generateCode = (obj: any, wsdl: string, filePath: string): void => {
  fs.writeFileSync(
    filePath,
    `
    import * as soap from 'soap';
    import { logger } from '@user-office-software/duo-logger';
    import { createHash } from 'crypto';

    export default class UOWSSoapClient {
      private static instance: UOWSSoapClient | undefined = undefined;
      private wsdlUrl: string;
      private client!: soap.Client;
      private activeUowsRequests: Map<string, Promise<any>> = new Map();
      private wsdlDesc: any = ${JSON.stringify(wsdlDesc)};

      static getInstance(): UOWSSoapClient {
        if (!this.instance) {
          this.instance = new UOWSSoapClient(process.env.EXTERNAL_AUTH_SERVICE_URL);
        }

        return this.instance;
      }

      ${constructorTemplate(wsdl)}

      private setClient() {
        logger.logInfo('Attempting to create UOWS client', {});
        soap.createClient(this.wsdlUrl, (error, client) => {
          if (error) {
            logger.logError('An error occurred while creating the UOWS client', {error: error});
            setTimeout(() => { this.setClient() }, 10000);
            return;
          }
          logger.logInfo('Created UOWS client', {});
          this.client = client
        });
      }

      ${Object.keys(obj)
        .map((element) => obj[element])
        .join('')}

      ${makeArgsObjTemplate}
    }
  `
  );
};

//Creates the UOWSService.ts file
const createInterface = async () => {
  const args = await getArgs();
  const wsdl: string = args._.length > 0 ? `${args._[0]}` : args.wsdl;
  const outputPath: string =
    args._.length > 1 ? `${args._[1]}` : args.outputPath;

  soap
    .createClientAsync(wsdl)
    .then((client: soap.Client) => {
      wsdlDesc = client.describe();

      return populateFuncts(wsdlDesc);
    })
    .then((obj: any) => {
      generateCode(obj, wsdl, outputPath);
    })
    .catch((err: any) => {
      process.exitCode = 1;
      console.error(err);
    });
};

createInterface();
