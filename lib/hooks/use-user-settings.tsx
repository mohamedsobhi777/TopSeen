import { useState, useEffect } from 'react';
import { UserAccount } from '@/db/model';

export function useUserSettings() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user-settings');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setError('Failed to fetch user settings');
      }
    } catch (err) {
      setError('Error fetching user settings');
      console.error('Error fetching user settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserSettings = async (updates: Partial<UserAccount>) => {
    try {
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(prev => prev ? { ...prev, ...updates } : null);
        return result;
      } else {
        throw new Error('Failed to update user settings');
      }
    } catch (err) {
      setError('Error updating user settings');
      console.error('Error updating user settings:', err);
      throw err;
    }
  };

  return {
    user,
    setUser,
    isLoading,
    error,
    updateUserSettings,
    refetch: fetchUserSettings,
  };
} 