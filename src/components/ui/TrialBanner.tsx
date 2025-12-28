'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';

interface TrialBannerProps {
  remainingUses: number;
  feature: string;
}

export function TrialBanner({ remainingUses, feature }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || remainingUses > 2) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {remainingUses === 0 ? (
            <>
              This is your last free visit to {feature}.{' '}
              <Link href="/auth/register" className="font-semibold underline hover:no-underline">
                Sign up now
              </Link>{' '}
              to keep using all features!
            </>
          ) : (
            <>
              You have <span className="font-bold">{remainingUses}</span> free {remainingUses === 1 ? 'visit' : 'visits'} left.{' '}
              <Link href="/auth/register" className="font-semibold underline hover:no-underline">
                Create an account
              </Link>{' '}
              for unlimited access!
            </>
          )}
        </span>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
