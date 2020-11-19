#!/usr/bin/env node

import * as fs from 'fs';

import * as soap from 'soap';

let defaultWsdl: string =
  'https://api.facilities.rl.ac.uk/ws/UserOfficeWebService?wsdl';
let wsdlDesc: any;

//Maps XML datatypes to Typescript datatypes
//Currently maps everything to 'any' or 'any[]' if it's a list, will be expanded in the future
const mapDataType = (functionArgumentType: string): string => {
  //switch (xmlDataType) {
  //    case 'decimal':
  //    case 'integer':
  //        return 'Number';
  //        break;
  //    default:
  //        return xmlDataType;
  //}
  //console.log(functionArgumentType);
  if (functionArgumentType.includes('[]')) return 'any[]';
  else return 'any';
};

//Constructs parameter requirements for a function
//Can extend it to allow for parameters with multiple types
const constructFunctArgString = (
  argDetails: string[][],
  includeType: boolean
): string => {
  let functArgString: string = '';
  argDetails.forEach((argDetail: string[], index: number) => {
    functArgString += `${argDetail[0]}`;
    if (includeType) functArgString += `: ${mapDataType(argDetail[1])}`;
    if (index < argDetails.length - 1) functArgString += ', ';
  });

  return functArgString;
};

//Constructs a string specifying a wrapper function for simplifying calling a specified web service function
const createFunctTemplate = (
  functName: string,
  argDetails: string[][]
): string => {
  const wrapperArgString: string = constructFunctArgString(argDetails, true);
  let makeArgObjArgs: string = constructFunctArgString(argDetails, false);

  if (argDetails.length > 0) makeArgObjArgs = ', ' + makeArgObjArgs;

  return `    public ${functName}(${wrapperArgString}): any {
                    let refinedResult: any =
                    soap.createClientAsync(this.wsdlUrl).then((client: soap.Client) => {
                        let argsObj: any = this.makeArgsObj('${functName}'${makeArgObjArgs});
                        return client['${functName}Async'](argsObj);
                    }).then((result: any) => {
                        return result[0];
                    }).catch((err: any) => {
                        console.error(err);
                    });

                    return refinedResult;
                }\n\n`;
};

//A string specifying a function for constructing an object from user-provided parameters for use by in SOAP function calls
const makeArgsObjTemplate: string = `   private makeArgsObj(functName: string, ...args: any[]): any {
            const argsObj: any = {};
            const serviceDesc: any = this.wsdlDesc[Object.keys(this.wsdlDesc)[0]];
            const collectionOfFunctions: any = serviceDesc[Object.keys(serviceDesc)[0]];
            let argsDescr: any = collectionOfFunctions[functName];

            Object.keys(argsDescr.input).forEach((element: string, index: number) => {
                if (element !== 'targetNSAlias' && element !== 'targetNamespace') {
                    let argName: string = element.replace('[]', '');
                    argsObj[argName] = args[index];
                }
            });
            return argsObj;
        }\n\n`;

//A string specifying the constructor for the UOWSSoapInterface class
const constructorTemplate: string = `   public constructor(wsdlUrl?: string) {
            if(wsdlUrl == null)
                this.wsdlUrl = '${defaultWsdl}';
            else
                this.wsdlUrl = wsdlUrl;
        }\n\n`;

//Creates an 2D array associating SOAP call parameters with their data types
//Ignores targetNSAlias and targetNamespace as they are not meant to be exposed to the user
const createFunctArgDetails = (functDesc: any): string[][] => {
  const functArgs: string[][] = [];
  Object.keys(functDesc.input).forEach((element: string, index: number) => {
    if (element !== 'targetNSAlias' && element !== 'targetNamespace') {
      const functArg: string[] = [];
      functArg[0] = element.replace('[]', '');

      if (typeof functDesc.input[element] === 'object') {
        functArg[1] = element; //if the argument is a complex type, assume the name of the argument is the same as the name of it's type
      } else {
        functArg[1] = functDesc.input[element];
        if (element.includes('[]')) functArg[1] += '[]';
      }

      functArgs[index] = functArg;
    }
  });

  return functArgs;
};

//Creates a wrapper function for each function exposed by a webservice and returns them in an object
const populateFuncts = (): any => {
  const functObj: any = {};
  const serviceDesc: any = wsdlDesc[Object.keys(wsdlDesc)[0]];
  const collectionOfFunctions: any = serviceDesc[Object.keys(serviceDesc)[0]];
  Object.keys(collectionOfFunctions).forEach((element: string) => {
    const functArgDetails: string[][] = createFunctArgDetails(
      collectionOfFunctions[element]
    );
    functObj[element] = createFunctTemplate(element, functArgDetails);
  });

  return functObj;
};

//Writes the UOWSSoapInterface.ts file to storage
const generateCode = (obj: any): void => {
  let filePath: string;

  if (process.argv[3]) filePath = process.argv[3];
  else filePath = './src/UOWSSoapInterface.ts';

  // eslint-disable-next-line prettier/prettier
  fs.writeFileSync(filePath, 'import * as soap from \'soap\';\n\n');
  fs.appendFileSync(filePath, 'export default class UOWSSoapClient {\n\n');
  fs.appendFileSync(filePath, 'private wsdlUrl: string;\n');
  fs.appendFileSync(
    filePath,
    `private wsdlDesc: any = ${JSON.stringify(wsdlDesc)};\n\n`
  );
  fs.appendFileSync(filePath, constructorTemplate);

  Object.keys(obj).forEach((element: string) => {
    fs.appendFileSync(filePath, obj[element]);
  });

  fs.appendFileSync(filePath, `${makeArgsObjTemplate}\n}`);
};

//Creates the UOWSService.ts file
const createInterface = (): void => {
  if (process.argv[2]) defaultWsdl = process.argv[2];

  soap
    .createClientAsync(defaultWsdl)
    .then((client: soap.Client) => {
      wsdlDesc = client.describe();

      return populateFuncts();
    })
    .then((obj: any) => {
      generateCode(obj);
    })
    .catch((err: any) => {
      console.error(err);
    });
};

createInterface();
