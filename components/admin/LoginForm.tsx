'use client';
import React, { useState } from 'react';
import { useLoginMutation } from '@/lib/redux/leadsApi';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/redux/authSlice';
import { ERROR_MESSAGES, BUTTON_TEXT } from '@/lib/constants/formText';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  // Validation functions
  const validateField = (field: string, value: string): string | null => {
    if (!value || value.trim() === '') {
      return ERROR_MESSAGES.required;
    }
    return null;
  };

  const handleFieldChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Mark field as touched
    setTouchedFields(prev => new Set([...prev, field]));
    
    // Clear submission error
    if (submissionError) {
      setSubmissionError(null);
    }
  };

  const handleFieldBlur = (field: 'username' | 'password') => {
    const value = credentials[field];
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setSubmissionError(null);
    
    // Validate all fields
    const newErrors: { username?: string; password?: string } = {};
    let hasErrors = false;
    
    Object.keys(credentials).forEach(field => {
      const error = validateField(field, credentials[field as keyof typeof credentials]);
      if (error) {
        newErrors[field as keyof typeof newErrors] = error;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const result = await loginMutation(credentials).unwrap();
      dispatch(login(result.user));
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle different types of errors
      if (error?.data?.error) {
        setSubmissionError(error.data.error);
      } else if (error?.message) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError(ERROR_MESSAGES.submissionFailed);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="p-4 rounded-lg mb-6 bg-alma-purple-light/50 text-alma-purple">
            <p className="text-sm font-medium">
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: password123
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Show submission error if any */}
            {submissionError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{submissionError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alma-purple focus:border-alma-purple ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                onBlur={() => handleFieldBlur('username')}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600">
                  {errors.username}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alma-purple focus:border-alma-purple ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={() => handleFieldBlur('password')}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-alma-purple hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alma-purple disabled:opacity-50"
              >
                {isLoading ? BUTTON_TEXT.signingIn : BUTTON_TEXT.signIn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;