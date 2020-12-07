import { createFunctTemplate } from '../construct-functions/constructFunctions';

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
export const populateFuncts = (wsdlDesc: any): any => {
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
