import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Profile() {
    const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/users/me', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return null; 
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      <div className="mb-2"><span className="font-semibold">Username:</span> {user.username}</div>
      <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
      <div className="mb-2">
        <span className="font-semibold">Role:</span> {user.isAdmin ? 'Admin' : 'User'}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Blocked:</span> {user.isBlocked ? 'Yes' : 'No'}
      </div>
    </div>
  )
}

export default Profile