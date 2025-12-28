'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const TRIAL_USAGE_KEY = 'financetrackr_trial_usage';
const MAX_FREE_USES = 3; // Number of free uses before login required

interface TrialUsage {
  transactions: number;
  budgets: number;
  goals: number;
  analytics: number;
}

const defaultUsage: TrialUsage = {
  transactions: 0,
  budgets: 0,
  goals: 0,
  analytics: 0,
};

type FeatureKey = keyof TrialUsage;

export function useTrialAccess(feature: FeatureKey) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is logged in, always allow access
    if (session) {
      setCanAccess(true);
      setIsLoading(false);
      return;
    }

    // If still loading session, wait
    if (status === 'loading') {
      return;
    }

    // Get current usage from localStorage
    const storedUsage = localStorage.getItem(TRIAL_USAGE_KEY);
    const usage: TrialUsage = storedUsage ? JSON.parse(storedUsage) : defaultUsage;
    
    const currentCount = usage[feature];
    setUsageCount(currentCount);

    if (currentCount >= MAX_FREE_USES) {
      // Exceeded free uses, redirect to login
      setCanAccess(false);
      router.push(`/auth/login?callbackUrl=/${feature}&trial=expired`);
    } else {
      // Increment usage count
      const newUsage = { ...usage, [feature]: currentCount + 1 };
      localStorage.setItem(TRIAL_USAGE_KEY, JSON.stringify(newUsage));
      setCanAccess(true);
    }
    
    setIsLoading(false);
  }, [session, status, feature, router]);

  const remainingUses = MAX_FREE_USES - usageCount;

  return { 
    canAccess, 
    isLoading, 
    isAuthenticated: !!session,
    remainingUses: Math.max(0, remainingUses - 1), // -1 because we already counted this visit
    maxFreeUses: MAX_FREE_USES 
  };
}
