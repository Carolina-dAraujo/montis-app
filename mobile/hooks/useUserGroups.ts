import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export interface MeetingSchedule {
  day: string;
  time: string;
  enabled: boolean;
}

export interface UserGroup {
  groupId: string;
  groupName: string;
  type: string;
  address: string;
  phone: string;
  schedule: string;
  distance: string;
  meetingSchedules: MeetingSchedule[];
  notificationsEnabled: boolean;
  online: boolean;
  addedAt: string;
}

export function useUserGroups() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await storageService.getAuthToken();
      if (!token) throw new Error('Usuário não autenticado');
      // Busca todos os grupos disponíveis
      const allAAGroups = await apiService.getAllAAGroups();
      // Busca os grupos do usuário
      const userGroups = await apiService.getUserGroups(token);
      // Faz merge dos dados completos
      const mergedGroups = userGroups.map((userGroup: any) => {
        // Tenta encontrar o grupo completo usando todos os campos possíveis de ID
        const userGroupId = String(userGroup.groupId ?? userGroup.id ?? userGroup.group_id);
        const full = allAAGroups.find((g: any) => String(g.id ?? g.groupId ?? g.group_id) === userGroupId);
        return {
          ...userGroup,
          groupName: full?.name || userGroup.groupName || userGroup.name || '',
          address: full?.address || userGroup.address || '',
          city: full?.city || userGroup.city || '',
          neighborhood: full?.neighborhood || userGroup.neighborhood || '',
          online: typeof full?.online === 'boolean' ? full.online : (userGroup.online ?? false),
          // outros campos do full, mas só se full existir
          ...(full ? full : {}),
        };
      });
      setGroups(mergedGroups);
    } catch (err) {
      setError('Erro ao carregar grupos');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleNotificationToggle = async (groupId: string, enabled: boolean) => {
    Alert.alert('Aviso', 'Notificações de grupo devem ser implementadas com Firebase.');
  };

  return {
    groups,
    loading,
    error,
    reloadGroups: loadGroups,
    handleNotificationToggle,
  };
} 