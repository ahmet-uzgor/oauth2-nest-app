import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from './interceptors/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  // app.useGlobalInterceptors(new TransformInterceptor());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Microlearning')
    .setDescription('Akademi Microlearning API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4427);
}
bootstrap();
