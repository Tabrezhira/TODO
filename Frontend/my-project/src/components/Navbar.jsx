import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/users/me', { withCredentials: true })
      .then(res => {
        setUsername(res.data.user?.username || '');
        setIsAdmin(res.data.user?.isAdmin || false);
      })
      .catch(() => {
        setUsername('');
        setIsAdmin(false);
      });
  }, []);

  const handleLogout = async () => {
    await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
    setUsername('');
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">Task App</Link>
      <div>
        {username ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="font-semibold hover:underline"
            >
              Hello, {username}
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="bg-yellow-400 text-blue-900 px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">Login</Link>
            <Link to="/signup" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
}