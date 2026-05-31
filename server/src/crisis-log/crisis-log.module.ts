import { Module } from '@nestjs/common';
import { CrisisLogController } from './crisis-log.controller';
import { CrisisLogService } from './crisis-log.service';

@Module({
	controllers: [CrisisLogController],
	providers: [CrisisLogService],
	exports: [CrisisLogService],
})
export class CrisisLogModule {}
