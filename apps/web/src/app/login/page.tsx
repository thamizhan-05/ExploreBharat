'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Compass, ShieldCheck, User, Store, KeyRound, ArrowRight } from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../../lib/api';
import Logo from '../../components/Logo';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUpMode = searchParams.get('mode') === 'signup';

  const [isRegister, setIsRegister] = useState(isSignUpMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.register({ email, password, name, phone });
        setAuthToken(res.data.accessToken);
        setCurrentUser(res.data.user);
      } else {
        const res = await api.login(email, password);
        setAuthToken(res.data.accessToken);
        setCurrentUser(res.data.user);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(demoEmail, demoPass);
      setAuthToken(res.data.accessToken);
      setCurrentUser(res.data.user);
      if (res.data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-xl">
        
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo variant="primary" size="lg" href="/" className="justify-center" />
          <h2 className="text-xl font-black text-[#132238] tracking-tight pt-2">
            {isRegister ? 'Join ExploreBharat' : 'Welcome to ExploreBharat'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister ? 'Create an account to discover places, plan trips, and book services' : 'Discover India • Plan Your Journey'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          {isRegister && (
            <>
              <div>
                <label className="text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-bharat-saffron"
                />
              </div>
              <div>
                <label className="text-stone-700 block mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-bharat-saffron"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-stone-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@explorebharat.local"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div>
            <label className="text-stone-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-bharat-saffron hover:bg-bharat-terracotta disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 text-sm transition-all"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-bharat-saffron hover:underline"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* DEMO ACCOUNTS ONE-CLICK ACCESS (Section 45) */}
        <div className="pt-6 border-t border-stone-100 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block text-center">
            Development Quick Login (Section 45)
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@explorebharat.local', 'Admin@1234')}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-left transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700 mb-1" />
              <p className="font-bold text-[11px]">Admin</p>
              <p className="text-[9px] text-purple-600 font-mono">admin@</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('vendor@explorebharat.local', 'Vendor@1234')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-left transition-colors"
            >
              <Store className="w-4 h-4 text-amber-700 mb-1" />
              <p className="font-bold text-[11px]">Vendor</p>
              <p className="text-[9px] text-amber-600 font-mono">vendor@</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('user@explorebharat.local', 'User@1234')}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl text-left transition-colors"
            >
              <User className="w-4 h-4 text-blue-700 mb-1" />
              <p className="font-bold text-[11px]">Traveler</p>
              <p className="text-[9px] text-blue-600 font-mono">user@</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
