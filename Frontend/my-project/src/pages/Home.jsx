import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [title, setTitle] = useState('');
  const [img, setImg] = useState(null);
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editImg, setEditImg] = useState(null);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    axios.get('http://localhost:3000/users/me', { withCredentials: true })
      .catch(() => navigate('/login'));
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/todos', { withCredentials: true });
      setTodos(res.data);
    } catch (err) {
      setTodos([]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!img) {
      alert('Image is required for each task.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('img', img);

    try {
      await axios.post('http://localhost:3000/todos', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitle('');
      setImg(null);
      fetchTodos();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create todo');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`, { withCredentials: true });
      fetchTodos();
    } catch (err) {
      alert('Failed to delete todo');
    }
  };

  const handleEdit = todo => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditImg(null);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!editTitle) {
      alert('Title is required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', editTitle);
    if (editImg) formData.append('img', editImg);

    try {
      await axios.put(`http://localhost:3000/todos/${editId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditId(null);
      setEditTitle('');
      setEditImg(null);
      fetchTodos();
    } catch (err) {
      alert('Failed to update todo');
    }
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => todo.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'asc') return a.title.localeCompare(b.title);
      else return b.title.localeCompare(a.title);
    });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Create Todo</h2>
        <input
          type="text"
          placeholder="Todo Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImg(e.target.files[0])}
          required
          className="w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Add Todo
        </button>
      </form>
      <div className="w-full max-w-md mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-2 py-2 border rounded"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Your Todos</h3>
        {filteredTodos.map(todo => (
          <div key={todo._id} className="bg-white p-4 mb-2 rounded shadow flex items-center">
            {editId === todo._id ? (
              <form onSubmit={handleUpdate} className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  className="px-2 py-1 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setEditImg(e.target.files[0])}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Save</button>
                  <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <span className="flex-1">{todo.title}</span>
                {todo.img && (
                  <img src={`http://localhost:3000/${todo.img}`} alt="todo" className="w-12 h-12 object-cover rounded ml-4" />
                )}
                <button
                  onClick={() => handleEdit(todo)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded ml-2 hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}