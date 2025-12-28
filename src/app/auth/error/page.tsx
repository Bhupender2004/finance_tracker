'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to access this resource.',
  Verification: 'The verification link may have expired or already been used.',
  OAuthSignin: 'Error in constructing an authorization URL.',
  OAuthCallback: 'Error in handling the response from OAuth provider.',
  OAuthCreateAccount: 'Could not create OAuth provider account.',
  EmailCreateAccount: 'Could not create email provider account.',
  Callback: 'Error in the OAuth callback handler route.',
  OAuthAccountNotLinked: 'This email is already associated with another account. Please sign in using your original provider.',
  EmailSignin: 'The email sign in link is invalid or has expired.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected error occurred. Please try again.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Error
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {errorMessage}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Link>
            
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
