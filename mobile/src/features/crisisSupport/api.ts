import { requestAuth } from '@/shared/api/client';
import type { CrisisEntry, CrisisSeverity, NewCrisisEntry } from '@/features/crisisSupport/types/crisisLog';

export type CreateCrisisLogDto = NewCrisisEntry & {
	date?: string;
	time?: string;
};

export type UpdateCrisisLogDto = Partial<CreateCrisisLogDto> & {
	severity?: CrisisSeverity;
};

export const crisisLogApi = {
	list: (token: string) =>
		requestAuth<CrisisEntry[]>('/crisis-log', token, { method: 'GET' }),

	create: (token: string, data: CreateCrisisLogDto) =>
		requestAuth<CrisisEntry>('/crisis-log', token, {
			method: 'POST',
			body: JSON.stringify(data),
		}),

	update: (token: string, id: string, data: UpdateCrisisLogDto) =>
		requestAuth<CrisisEntry>(`/crisis-log/${id}`, token, {
			method: 'PUT',
			body: JSON.stringify(data),
		}),

	delete: (token: string, id: string) =>
		requestAuth<{ message: string }>(`/crisis-log/${id}`, token, { method: 'DELETE' }),
};
