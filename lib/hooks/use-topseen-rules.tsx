import { useState, useEffect } from 'react';
import { TopSeenRule } from '@/db/model';

export function useTopSeenRules(userId: string = 'default-user') {
  const [rules, setRules] = useState<TopSeenRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rules
  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/topseen-rules?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setRules(data.rules);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch rules');
      }
    } catch (err) {
      setError('Failed to fetch rules');
      console.error('Error fetching rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new rule
  const createRule = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/topseen-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, userId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRules(prev => [...prev, data.rule]);
        return { success: true, rule: data.rule };
      } else {
        return { success: false, error: data.error || 'Failed to create rule' };
      }
    } catch (err) {
      console.error('Error creating rule:', err);
      return { success: false, error: 'Failed to create rule' };
    }
  };

  // Update a rule
  const updateRule = async (id: string, updates: Partial<Pick<TopSeenRule, 'name' | 'description' | 'isActive'>>) => {
    try {
      const response = await fetch('/api/topseen-rules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userId, ...updates }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRules(prev => prev.map(rule => rule.id === id ? data.rule : rule));
        return { success: true, rule: data.rule };
      } else {
        return { success: false, error: data.error || 'Failed to update rule' };
      }
    } catch (err) {
      console.error('Error updating rule:', err);
      return { success: false, error: 'Failed to update rule' };
    }
  };

  // Delete a rule
  const deleteRule = async (id: string) => {
    try {
      const response = await fetch(`/api/topseen-rules?id=${id}&userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        setRules(prev => prev.filter(rule => rule.id !== id));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to delete rule' };
      }
    } catch (err) {
      console.error('Error deleting rule:', err);
      return { success: false, error: 'Failed to delete rule' };
    }
  };

  // Toggle rule active status
  const toggleRule = async (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return { success: false, error: 'Rule not found' };
    
    return updateRule(id, { isActive: !rule.isActive });
  };

  useEffect(() => {
    fetchRules();
  }, [userId]);

  return {
    rules,
    isLoading,
    error,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  };
} 