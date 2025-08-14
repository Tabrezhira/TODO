import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Check admin authentication on mount
  useEffect(() => {
    axios.get('http://localhost:3000/users/me', { withCredentials: true })
      .then(res => {
        if (!res.data.user?.isAdmin) navigate('/');
      })
      .catch(() => navigate('/login'));
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users/all', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const handleBlock = async id => {
    if (!window.confirm('Are you sure you want to block this user?')) return;
    try {
      await axios.post(`http://localhost:3000/users/block/${id}`, {}, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert('Failed to block user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Registered Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Blocked</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="py-2 px-4 border">{user.username}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.isAdmin ? 'Admin' : 'User'}</td>
              <td className="py-2 px-4 border">{user.isBlocked ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border">
                {!user.isBlocked && !user.isAdmin && (
                  <button
                    onClick={() => handleBlock(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Block
                  </button>
                )}
                {user.isBlocked && <span className="text-red-500 font-semibold">Blocked</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}