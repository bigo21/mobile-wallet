'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.assign('/admin');
      } else {
        setError(data.error || 'Erreur de connexion.');
        setLoading(false);
      }
    } catch {
      setError('Erreur réseau. Réessayez.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f4f5] px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <span className="text-2xl font-bold">
            Mobile<span className="text-[#F9A825]">Wallet</span>
          </span>
          <p className="mt-1 text-sm text-gray-500">Espace administration</p>
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm p-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pw" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Mot de passe
            </label>
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F9A825] hover:bg-[#F57C00] text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}
