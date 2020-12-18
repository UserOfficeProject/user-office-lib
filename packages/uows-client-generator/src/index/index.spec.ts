import * as fs from 'fs';

import { getRootPath, cli } from '../test-utils/test-utils';

const clientFilePath: string =
  '/src/UOWSServiceClient/UOWSServiceClientIndexTest.ts';

test('Code should be 0', async () => {
  const outputFilePath: string = getRootPath(clientFilePath);

  const wsdlFilePath: string = getRootPath(
    '/src/UserOfficeWebServiceTest.wsdl'
  );

  const result: any = await cli([wsdlFilePath, outputFilePath], '.');
  if (result.code === 0) fs.unlinkSync(`.${clientFilePath}`);
  expect(result.code).toBe(0);
});
