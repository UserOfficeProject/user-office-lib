import { exec } from 'child_process';
import path from 'path';

const getLibPath = (): string => {
  const fullPath: string = __dirname;
  let pathList: string[] = fullPath.split('/');
  pathList = pathList.slice(0, pathList.length - 2);
  let libPath = pathList.join('/');
  libPath += '/lib/index';

  return libPath;
};

const cli = (args: string[]): Promise<any> => {
  return new Promise(resolve => {
    exec(
      `node ${path.resolve(getLibPath() + ' ')} ${args.join(' ')}`,
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      }
    );
  });
};

test('Code should be 0', async () => {
  const result: any = await cli(['../UserOfficeWebServiceTest.wsdl']);
  expect(result.code).toBe(0);
});
