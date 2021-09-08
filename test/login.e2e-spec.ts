import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, LoggerService } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Authentication', () => {
    let jwtToken: string;
    let refreshToken: string;

    describe('AuthModule', () => {
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'aktasceren@outlook.com', password: 'password' })
          .expect(200);

        // set jwt token for use in subsequent tests
        jwtToken = response.body.data.accessToken;
        refreshToken = response.body.data.refreshToken;
        console.log(refreshToken);
        // expect(jwtToken).toMatch(
        //   /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        // ); // jwt regex
      });

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
          .expect(401)
          .expect({
            status: 401,
            error: 'Email or password is incorrect.',
          });

        expect(response.body.accessToken).not.toBeDefined();
      });
    });

    describe('Users', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        const data = response.body.data;
      });
    });

    describe('Refresh', () => {
      it('refresh', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refreshToken: refreshToken })
          .expect(201);
      });
    });
  });
});
