import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './casl/casl.module';
import { MailModule } from './mail/mail.module';
import { ResetModule } from './reset/reset.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { TranslationsModule } from './translations/translations.module';
import { LanguagesModule } from './languages/languages.module';
import { Language } from './languages/entities/language.entity';
import { SlidersModule } from './sliders/sliders.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StoriesModule } from './story/stories.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { StatisticModule } from './statistic/statistic.module';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import * as path from 'path';
import { I18nExceptionsFilter } from './interceptors/i18n-filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { I18nHelper } from './common/helpers/i18n.helper';
import { ServiceModule } from './service/service.module';
import { InvitationsModule } from './invitations/invitations.module';
import { BullModule } from '@nestjs/bull';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    I18nModule.forRootAsync({
      useFactory: () => {
        return {
          fallbackLanguage: 'tr',
          fallbacks: {
            'en-*': 'en',
            'tr-*': 'TR',
            pt: 'pt-BR',
          },
          parserOptions: {
            path: path.join(__dirname, '/i18n'),
          },
        };
      },
      parser: I18nJsonParser,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.${ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'prod',
      autoLoadEntities: true,
      entities: [Language],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    UsersModule,
    AuthModule,
    CaslModule,
    MailModule,
    ResetModule,
    TranslationsModule,
    LanguagesModule,
    SlidersModule,
    StoriesModule,
    StatisticModule,
    ServiceModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [
    I18nHelper,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: I18nExceptionsFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: I18nExceptionsFilter,
    // },
  ],
})
export class AppModule {}
