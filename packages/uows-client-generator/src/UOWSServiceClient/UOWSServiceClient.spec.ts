import * as fs from 'fs';

import UOWSSoapClient from './UOWSServiceClient';

afterAll(() => {
  return fs.unlinkSync('./src/UOWSServiceClient/UOWSServiceClient.ts');
});

test('Should return age range result from mocked soap module', async () => {
  const client: UOWSSoapClient = UOWSSoapClient.getInstance();
  const result: any = await client.getAgeRangeOptions();

  expect(result).toBe('1-99');
});

test('Should return establishment details result from mocked soap module', async () => {
  const client: UOWSSoapClient = UOWSSoapClient.getInstance();

  const searchDetails: any[] = [
    {
      departmentName: 'Institute de Chime Moleculaire et Biologique [ICMB]',
      organisationName: 'Ecole Polytechnique Federale de Lausanne',
    },
    {
      departmentName: 'Department of Materials Science',
      organisationName: 'Argonne National Laboratory',
    },
  ];

  const result: any = await client.getEstablishmentDTOsBySearchDetails(
    searchDetails
  );

  expect(result).toStrictEqual(['ISIS', 'SCD']);
});
