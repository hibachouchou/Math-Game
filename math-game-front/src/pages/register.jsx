import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 Use context

  const avatars = [
    { id: 'male', src: '/male-avatar.png', label: 'male' },
    { id: 'female', src: '/female-avatar.png', label: 'female' }
  ];

  const [form, setForm] = useState({
    username: '',
    avatar: avatars[0].src,
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  function handleChange(e) {
    console.log("✏️ Input changed:", e.target.name, "=", e.target.value);
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function chooseAvatar(src) {
    console.log("🖼️ Avatar selected:", src);
    setForm(prev => ({ ...prev, avatar: src }));
  }

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async e => {
    e.preventDefault();
    setError('');

    console.log("📤 Form submitted:", form);

    // Validation
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError('⚠️ All fields are required.');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('⚠️ Invalid email address.');
      return;
    }
    if (form.password.length <= 4) {
      setError('⚠️ Password must be more than 4 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('⚠️ Passwords do not match.');
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      avatarLabel: form.avatar === avatars[0].src ? 'male' : 'female'
    };

    console.log("🚀 Sending request:", payload);

    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log("📥 Backend response:", data);

      if (!res.ok) throw new Error(data.message || 'Register failed');

      console.log("🔐 Saving token to context...");
      login(data.token, payload.avatarLabel); // 🔥 Context API

      alert('✅ Registered successfully!');
      navigate('/');

    } catch (err) {
      console.log("🔥 Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-10 lg:p-12">

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Create an account</h2>
        <p className="text-sm text-gray-500 mb-6">Sign up to play the math game!</p>

        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 border border-red-100">{error}</div>}

        <form onSubmit={submit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
              placeholder="Choose a username"
            />
          </div>

          {/* Avatar selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose an avatar</label>
            <div className="flex flex-wrap gap-4">
              {avatars.map(a => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => chooseAvatar(a.src)}
                  className={`flex flex-col items-center gap-2 px-3 py-2 rounded-lg border transition-shadow ${
                    form.avatar === a.src ? 'ring-2 ring-sky-400 shadow-lg border-sky-300' : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <img src={a.src} alt={a.label} className="w-20 h-20 object-contain" />
                  <span className="text-xs text-gray-600">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
              placeholder="you@example.com"
            />
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
                placeholder="More than 4 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300"
                placeholder="Repeat password"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded-lg shadow">
              Create account
            </button>
            <Link to="/" className="text-sm text-sky-600 hover:underline">Already have an account?</Link>
          </div>

        </form>
      </div>
    </div>
  );
}
