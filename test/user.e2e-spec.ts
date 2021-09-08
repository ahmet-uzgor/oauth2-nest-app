import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/ (POST)', async () => {
  //   return await request(app.getHttpServer())
  //     .post('/users')
  //     .send({
  //       name: 'mavi',
  //       surname: 'salli',
  //       email: 'mavi.baris96@gmail.com',
  //       password: '123456',
  //     })
  //     .expect(201);
  // });
});
