const soap: any = {};

const serviceMock = {
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

soap.createClient = (
  url: string,
  callback: (error: any, client: any) => void
) => {
  callback(null, serviceMock);
};

module.exports = soap;
