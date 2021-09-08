import { NestFactory } from '@nestjs/core';
import { Seeder } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);
      seeder.init();
      // appContext.close();
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
