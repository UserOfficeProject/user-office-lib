#!/usr/bin/env node

import * as fs from 'fs';

import * as soap from 'soap';

import {
  constructorTemplate,
  makeArgsObjTemplate,
} from '../construct-functions/constructFunctions';
import { populateFuncts } from '../create-service-description/createServiceDescription';

const defaultWsdl: string =
  'https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl';
const defaultFilePath: string = './UOWSSoapInterface.ts';
let wsdlDesc: any;

//Writes the UOWSSoapInterface.ts file to storage
const generateCode = (obj: any): void => {
  const filePath: string = process.argv[3] ? process.argv[3] : defaultFilePath;

  /*eslint quotes: ["error", "single", { "avoidEscape": true }]*/
  fs.writeFileSync(filePath, "import * as soap from 'soap';\n\n");
  fs.appendFileSync(filePath, 'export default class UOWSSoapClient {\n\n');
  fs.appendFileSync(filePath, 'private wsdlUrl: string;\n');
  fs.appendFileSync(
    filePath,
    `private wsdlDesc: any = ${JSON.stringify(wsdlDesc)};\n\n`
  );
  fs.appendFileSync(filePath, constructorTemplate(defaultWsdl));

  Object.keys(obj).forEach((element: string) => {
    fs.appendFileSync(filePath, obj[element]);
  });

  fs.appendFileSync(filePath, `${makeArgsObjTemplate}\n}`);
};

//Creates the UOWSService.ts file
const createInterface = (): void => {
  const wsdlUrl: string = process.argv[2] ? process.argv[2] : defaultWsdl;

  soap
    .createClientAsync(wsdlUrl)
    .then((client: soap.Client) => {
      wsdlDesc = client.describe();

      return populateFuncts(wsdlDesc);
    })
    .then((obj: any) => {
      generateCode(obj);
    })
    .catch((err: any) => {
      process.exitCode = 1;
      console.error(err);
    });
};

createInterface();
