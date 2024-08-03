import { Module } from '@nestjs/common';
import { QualificationService } from './qualification.service';
import { QualificationController } from './qualification.controller';
import { EventModule } from 'src/event/event.module';

@Module({
  providers: [QualificationService],
  controllers: [QualificationController],
  imports: [EventModule],
})
export class QualificationModule {}
