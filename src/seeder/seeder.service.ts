import { Injectable, Logger } from '@nestjs/common';
import { LanguageService } from 'src/languages/languages.service';
import { PageTypeService } from 'src/story/services/page-types.service';

import * as fs from 'fs';
import { join } from 'path';
import data from './data';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly logger: Logger,
    private readonly languageService: LanguageService,
    private readonly pageTypeService: PageTypeService,
    private readonly userService: UsersService,
  ) {}

  checkFunctions() {
    for (const property in data) {
      let isFindOne = false;
      let isCreate = false;
      this.logger.warn(`[${property}.ts]: processing.`);
      this.logger.warn(`[${property}.ts]: service is searching.`);

      if (this[data[property].service])
        this.logger.log(`[${property}.ts]: the service has been found.`);
      else {
        delete data[property];
        this.logger.error(`[${property}.ts]: the service could not be found.`);
        continue;
      }

      this.logger.warn(`[${property}.ts]: searching for findOne function.`);
      if ('findOne' in this[data[property].service]) {
        this.logger.log(
          `[${property}.ts]: the findOne function has been found.`,
        );
        isFindOne = true;
      } else
        this.logger.error(
          `[${property}.ts]: the findOne function could not be found.`,
        );

      if ('create' in this[data[property].service]) {
        this.logger.log(
          `[${property}.ts]: the create function has been found.`,
        );
        isCreate = true;
      } else
        this.logger.error(
          `[${property}.ts] the create function could not be found.`,
        );
      if (!isFindOne || !isCreate) {
        this.logger.debug(`[${property}.ts]: continue`);
        delete data[property];
        continue;
      }
    }

    return data;
  }

  async writeDatabase(d) {
    for (const property in d) {
      const service = this[data[property].service];
      for (let i = 0; i < data[property].results.length; i++) {
        const item = data[property].results[i];
        const currentItem = await service.findOne({
          [d[property].where]: item[d[property].where],
        });
        if (currentItem)
          this.logger.error(
            `[${property}.ts]: ${item[d[property].where]} already saved.`,
          );
        else {
          this.logger.log(
            `[${property}.ts]: ${item[d[property].where]} saved.`,
          );
          await service.create(item);
        }
      }
    }
  }

  async init() {
    const allData = this.checkFunctions();
    this.writeDatabase(allData);
  }
}
