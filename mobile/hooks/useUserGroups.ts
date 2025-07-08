import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../services/api';

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
      const aaGroups = await apiService.getAllAAGroups();
      setGroups(aaGroups);
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