const soap: any = {};

const serviceMock: any = {
  getAgeRangeOptionsAsync: async function () {
    return new Promise<any>((resolve) => {
      resolve(['1-99']);
    });
  },
  getEstablishmentDTOsBySearchDetailsAsync: function (searchDetails: any) {
    return new Promise<any>((resolve) => {
      resolve([['ISIS', 'SCD']]);
    });
  },
};

const createClientAsync = async (): Promise<any> => {
  return new Promise<any>((resolve) => {
    resolve(serviceMock);
  });
};

soap.createClientAsync = createClientAsync;

module.exports = soap;
