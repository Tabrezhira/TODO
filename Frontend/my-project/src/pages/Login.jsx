import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:3000/users/me', { withCredentials: true })
      .then(res => {
        const user = res.data.user;
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      })
      .catch(() => setLoading(false)); // If not valid, show login form
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users/login', form, { withCredentials: true });

      if (res.data.token) {
        if (res.data.user?.isBlocked) {
          alert('Your account is blocked. Please contact admin.');
          return;
        }
        alert('Login successful');
        const userData = {
          token: res.data.token,
          user: {
            email: res.data.user.email,
            username: res.data.user.username,
            isAdmin: res.data.user.isAdmin,
            isBlocked: res.data.user.isBlocked,
          },
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        if (res.data.user?.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(res.data.error || 'Login failed');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  if (loading) return null; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}