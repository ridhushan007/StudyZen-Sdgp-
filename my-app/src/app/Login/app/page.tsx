'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaBook, FaGraduationCap } from 'react-icons/fa';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log(isLogin ? 'Login' : 'Signup', { email, password, name });
  };

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <FaGraduationCap className="text-blue-600 text-5xl" />
            <FaBook className="text-blue-500 text-4xl ml-2" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 tracking-tight">
            StudyZen
          </h1>
          <p className="text-blue-600 mt-2 font-medium">
            Your Personal Progress Companion
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative group animate-slide-in">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-blue-500 form-input-icon" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="form-input pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative group animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-blue-500 form-input-icon" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="form-input pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                required
              />
            </div>
            
            <div className="relative group animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-blue-500 form-input-icon" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-input pl-10 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl animate-slide-in"
              style={{ animationDelay: '0.3s' }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}