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

  return `    public async ${functName}(${wrapperArgString}) : Promise<any> {
                  const refinedResult = soap.createClientAsync(this.wsdlUrl).then((client: soap.Client) => {
                      const argsObj = this.makeArgsObj('${functName}'${makeArgObjArgs});
                      return client['${functName}Async'](argsObj);
                  }).then(result => {
                      return result[0];
                  });
                  return refinedResult;
              }\n\n`;
};

//A string specifying a function for constructing an object from user-provided parameters for use by in SOAP function calls
export const makeArgsObjTemplate: string = `   private makeArgsObj(functName: string, ...args: any[]) {
              const argsObj : {[key: string]: any} = {};
              const serviceDesc = this.wsdlDesc[Object.keys(this.wsdlDesc)[0]];
              const collectionOfFunctions = serviceDesc[Object.keys(serviceDesc)[0]];
              const argsDescr = collectionOfFunctions[functName];
  
              Object.keys(argsDescr.input).forEach((element: string, index: number) => {
                  if (element !== 'targetNSAlias' && element !== 'targetNamespace') {
                      const argName: string = element.replace('[]', '');
                      argsObj[argName] = args[index];
                  }
              });
              return argsObj;
          }\n\n`;

//A string specifying the constructor for the UOWSSoapInterface class
export const constructorTemplate = (wsdl: string) => {
  return `   public constructor(wsdlUrl?: string) {
              if(wsdlUrl == null)
                  this.wsdlUrl = '${wsdl}';
              else
                  this.wsdlUrl = wsdlUrl;
          }\n\n`;
};
