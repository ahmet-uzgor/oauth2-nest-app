import { Logger, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { LanguagesModule } from 'src/languages/languages.module';
import { LanguageService } from 'src/languages/languages.service';
import { StoriesModule } from 'src/story/stories.module';
import { UsersModule } from 'src/users/users.module';
import { Seeder } from './seeder.service';

@Module({
  imports: [AppModule, LanguagesModule, StoriesModule, UsersModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
