
import React, { useState } from 'react';
import { AccountType, UserProfile } from '../types';
import { api } from '../services/api';
interface AuthProps {
  type: 'login' | 'signup';
  // Use Partial<UserProfile> to allow calling it with only core authentication fields
  onAuthSuccess: (user: Partial<UserProfile>) => void;
  onNavigate: (page: string) => void;
}

const Auth: React.FC<AuthProps> = ({ type, onAuthSuccess, onNavigate }) => {
  const [role, setRole] = useState<AccountType>(AccountType.CANDIDATE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'login') {
        const data = await api.login({ contactEmail: email, password });
        onAuthSuccess(data.user);
      } else {
        const data = await api.register({
          fullName: name || 'New User',
          contactEmail: email,
          password,
          accountType: role
        });
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {type === 'login' ? 'Welcome Back' : 'Join Recruitment App'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {type === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button 
              onClick={() => onNavigate(type === 'login' ? 'signup' : 'login')}
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}

          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Role</label>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setRole(AccountType.CANDIDATE)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition ${role === AccountType.CANDIDATE ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-200 text-slate-500'}`}
                >
                  Job Seeker
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(AccountType.EMPLOYER)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition ${role === AccountType.EMPLOYER ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-slate-200 text-slate-500'}`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          )}

          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
