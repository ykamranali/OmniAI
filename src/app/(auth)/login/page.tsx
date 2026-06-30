"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kamran@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (res?.error) {
          throw new Error(res.error);
        }
        
        router.push('/dashboard');
        router.refresh();
      } else {
        // Mock registration logic for now since we just want Google to work out of the box, 
        // but in a real app you'd hit an API to create the user, then signIn.
        throw new Error("Credentials registration is disabled. Please use Google Login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
      
      <div className="auth-card w-full max-w-4xl flex shadow-2xl rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
        <div className="auth-brand p-10 flex-1 hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-900 to-gray-900 border-r border-gray-700">
          <div className="brand-logo flex items-center gap-3 mb-6">
            <svg className="logo-icon w-12 h-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="url(#logo-grad)" />
              <polygon points="50,15 83,30 83,70 50,85 17,70 17,30" fill="#0D1425" />
              <path d="M42,32 L60,45 L40,55 L58,68" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div className="brand-text text-2xl font-bold">OmniAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Nexus</span></div>
          </div>
          <p className="brand-tagline text-gray-400 mb-8">The ultimate AI business operating system. Automate, create, and scale your brand across all digital platforms in real-time.</p>
          
          <div className="brand-features flex flex-col gap-6">
            <div className="brand-feature-item flex gap-4">
              <div className="feat-icon flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400"><i className="bx bx-bot text-xl"></i></div>
              <div className="feat-desc">
                <h4 className="font-semibold text-gray-200">Multi-AI Engine Hub</h4>
                <p className="text-sm text-gray-500">Harness OpenAI, Gemini, Claude, and DeepSeek from one command center.</p>
              </div>
            </div>
            <div className="brand-feature-item flex gap-4">
              <div className="feat-icon flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400"><i className="bx bx-bar-chart-alt-2 text-xl"></i></div>
              <div className="feat-desc">
                <h4 className="font-semibold text-gray-200">Predictive Insights</h4>
                <p className="text-sm text-gray-500">Track real-time cross-platform metrics and customer growth trends.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-forms p-10 flex-1 bg-gray-800">
          <form onSubmit={handleSubmit} className="auth-form-panel flex flex-col gap-4 h-full justify-center">
            <h2 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle text-gray-400 mb-4">{isLogin ? 'Sign in to access your intelligent command center' : 'Get started with your free account'}</p>
            
            {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{error}</div>}

            {!isLogin && (
              <div className="input-group flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300" htmlFor="signup-name">Full Name</label>
                <div className="input-wrapper relative flex items-center">
                  <i className="bx bx-user absolute left-3 text-gray-500"></i>
                  <input className="w-full bg-gray-900 border border-gray-700 rounded-md py-2.5 pl-10 pr-3 focus:outline-none focus:border-indigo-500 transition-colors" type="text" id="signup-name" placeholder="Kamran Ahmad" required={!isLogin} value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            )}

            <div className="input-group flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email Address</label>
              <div className="input-wrapper relative flex items-center">
                <i className="bx bx-envelope absolute left-3 text-gray-500"></i>
                <input className="w-full bg-gray-900 border border-gray-700 rounded-md py-2.5 pl-10 pr-3 focus:outline-none focus:border-indigo-500 transition-colors" type="email" id="email" placeholder="name@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="input-group flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
              <div className="input-wrapper relative flex items-center">
                <i className="bx bx-lock-alt absolute left-3 text-gray-500"></i>
                <input className="w-full bg-gray-900 border border-gray-700 rounded-md py-2.5 pl-10 pr-3 focus:outline-none focus:border-indigo-500 transition-colors" type="password" id="password" placeholder="••••••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            {isLogin && (
              <div className="form-actions-row flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                  <input type="checkbox" defaultChecked className="rounded border-gray-700 text-indigo-500 focus:ring-indigo-500 bg-gray-900" />
                  Remember me
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</a>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <i className="bx bx-loader-alt bx-spin"></i> : <i className={`bx ${isLogin ? 'bx-log-in' : 'bx-user-plus'}`}></i>}
              {isLogin ? 'Sign In to Nexus' : 'Create Account'}
            </button>

            <div className="auth-divider flex items-center text-center my-4 text-gray-500 text-xs uppercase tracking-wider">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-3">or continue with</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>

            <div className="social-auth-row flex gap-3">
              <button type="button" onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 py-2 rounded-md transition-colors text-sm font-medium">
                <i className="bx bxl-google text-lg"></i> Google
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 py-2 rounded-md transition-colors text-sm font-medium">
                <i className="bx bxl-apple text-lg"></i> Apple
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-400 hover:text-indigo-300 font-medium">
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
