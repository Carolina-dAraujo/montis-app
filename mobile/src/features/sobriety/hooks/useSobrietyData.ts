import { useQuery } from '@tanstack/react-query';
import { sobrietyApi } from '@/features/sobriety/api';
import { sobrietyQueryKeys } from '@/features/sobriety/queryKeys';
import { storageService } from '@/shared/lib/storage';
import { useAuth } from '@/features/auth/context/AuthProvider';

export function useSobrietyData() {
	const { isAuthenticated } = useAuth();

	return useQuery({
		queryKey: sobrietyQueryKeys.data(),
		queryFn: async () => {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');
			try {
				return await sobrietyApi.getData(token);
			} catch (err) {
				const message = err instanceof Error ? err.message.toLowerCase() : '';
				if (message.includes('not found') || message.includes('404')) {
					return null;
				}
				throw err;
			}
		},
		enabled: isAuthenticated,
		retry: false,
	});
}
