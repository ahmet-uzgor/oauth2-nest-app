import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const basename = path.basename(__filename);
const data: any = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
    );
  })
  .forEach((file) => {
    const fileName = `${file.replace('.ts', '').toLowerCase()}`;
    data[fileName] = require(path.join(__dirname, file));
    Logger.debug(`Read: ${fileName}`);
    Logger.debug(
      `[${file}]: Data Results Length: ${data[fileName].results.length} `,
    );
  });

export default data;
