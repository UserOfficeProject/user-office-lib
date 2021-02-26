import { exec } from 'child_process';
import path from 'path';

export const getRootPath = (append: string): string => {
  const fullPath: string = __dirname;

  const isWin = process.platform === 'win32';
  let pathList: string[] = isWin ? fullPath.split('\\') : fullPath.split('/');
  pathList = pathList.slice(0, pathList.length - 2);

  let path = pathList.join('/');
  path += append;

  return path;
};

export const cli = (args: string[], cwd: string): Promise<any> => {
  return new Promise((resolve) => {
    exec(
      `ts-node ${path.resolve(getRootPath('/src/index/index.ts'))} ${args.join(
        ' '
      )}`,
      { cwd },
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
