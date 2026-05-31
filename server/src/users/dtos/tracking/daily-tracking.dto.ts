import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

const ALCOHOL_LEVELS = ['none', 'light', 'moderate', 'heavy'] as const;
const EXERCISE_LEVELS = ['none', 'light', 'moderate', 'intense'] as const;
const MOOD_LEVELS = ['great', 'good', 'neutral', 'bad', 'terrible'] as const;

export class DailyTrackingDto {
	@ApiProperty({ enum: ALCOHOL_LEVELS })
	@IsIn(ALCOHOL_LEVELS)
	alcohol: (typeof ALCOHOL_LEVELS)[number];

	@ApiProperty({ enum: EXERCISE_LEVELS })
	@IsIn(EXERCISE_LEVELS)
	exercise: (typeof EXERCISE_LEVELS)[number];

	@ApiProperty({ enum: MOOD_LEVELS })
	@IsIn(MOOD_LEVELS)
	mood: (typeof MOOD_LEVELS)[number];

	@ApiPropertyOptional({ nullable: true })
	@IsOptional()
	@IsNumber()
	sleep?: number | null;
}
