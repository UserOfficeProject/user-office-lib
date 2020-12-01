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
export const createFunctTemplate = (
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
export const makeArgsObjTemplate: string = `   private makeArgsObj(functName: string, ...args: any[]): any {
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
export const constructorTemplate = (defaultWsdl: string) => {
  return `   public constructor(wsdlUrl?: string) {
              if(wsdlUrl == null)
                  this.wsdlUrl = '${
                    process.argv[2] ? process.argv[2] : defaultWsdl
                  }';
              else
                  this.wsdlUrl = wsdlUrl;
          }\n\n`;
};
