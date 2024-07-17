import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule],
  controllers: [AppController],
})
export class AppModule {}
