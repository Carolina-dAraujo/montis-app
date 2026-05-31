export type AlcoholLevel = 'none' | 'light' | 'moderate' | 'heavy';
export type ExerciseLevel = 'none' | 'light' | 'moderate' | 'intense';
export type MoodLevel = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface DailyTrackingRecord {
	alcohol: AlcoholLevel;
	exercise: ExerciseLevel;
	mood: MoodLevel;
	sleep: number | null;
}
