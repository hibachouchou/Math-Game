import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const submit = async e => {
    e.preventDefault();
    setError('');

    // ---------------- VALIDATION ----------------
    if (!form.emailOrUsername.trim() || !form.password.trim()) {
      setError('⚠️ Please fill all required fields.');
      return;
    }

    if (form.password.length <= 4) {
      setError('⚠️ Password must be greater than 4 characters.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        throw new Error(data.message);
      }

      // ----------- Save username, avatar & token -----------
      // Si backend ne renvoie pas username, on peut le récupérer depuis le token avec jwt-decode
      // ou l'envoyer côté backend. Ici on suppose que backend renvoie maintenant username.
      localStorage.setItem('token', data.token);
      localStorage.setItem('avatarLabel', data.avatarLabel);
      localStorage.setItem('username', data.username); // <-- important !

      navigate('/test1');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 md:p-10">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Welcome back 👋</h2>
        <p className="text-sm text-gray-500 mb-6">Login to continue your math adventure!</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Username</label>
            <input
              name="emailOrUsername"
              value={form.emailOrUsername}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300 outline-none"
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300 outline-none"
              placeholder="Your password"
            />
          </div>

          <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold w-full py-2 rounded-lg shadow-lg transition">
            Login
          </button>
        </form>

        <div className="mt-5 text-sm text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-sky-600 hover:underline font-medium">Create one</Link>
        </div>
      </div>
    </div>
  );
}
