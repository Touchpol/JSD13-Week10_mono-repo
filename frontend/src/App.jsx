import { useState, useEffect } from 'react';
import { api } from './services/api';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
  const [dataSource, setDataSource] = useState('mongodb');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [auth, setAuth] = useState({ user: null, loading: true });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (dataSource === 'fake') {
        data = await api.getUsersV1();
      } else if (dataSource === 'mongodb') {
        const response = await api.getUsersV2();
        data = response.data || response;
      } else {
        const response = await api.getUsersSupabase();
        data = response.data || response;
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.checkAuthV2();
      setAuth({ user: response.data, loading: false });
    } catch {
      setAuth({ user: null, loading: false });
    }
  };

  useEffect(() => {
    fetchUsers();
    checkAuth();
  }, [dataSource]);

  const handleCreate = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      if (dataSource === 'fake') {
        await api.createUserV1(userData);
      } else if (dataSource === 'mongodb') {
        await api.createUserV2(userData);
      } else {
        await api.createUserSupabase(userData);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      if (dataSource === 'fake') {
        await api.updateUserV1(id, userData);
      } else if (dataSource === 'mongodb') {
        await api.updateUserV2(id, userData);
      } else {
        await api.updateUserSupabase(id, userData);
      }
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    setError(null);
    try {
      if (dataSource === 'fake') {
        await api.deleteUserV1(id);
      } else if (dataSource === 'mongodb') {
        await api.deleteUserV2(id);
      } else {
        await api.deleteUserSupabase(id);
      }
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await api.loginUserV2(credentials);
      checkAuth();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logoutUserV2();
      setAuth({ user: null, loading: false });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <div className="flex items-center gap-4">
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fake">Fake DB (v1)</option>
                <option value="mongodb">MongoDB (v2)</option>
                <option value="supabase">Supabase (v2)</option>
              </select>
              
              {auth.user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {auth.user.username} ({auth.user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <AuthForm onLogin={handleLogin} />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Users ({users.length})
          </h2>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Add User
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <UserForm
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
                initialData={editingUser}
                isEditing={!!editingUser}
                dataSource={dataSource}
              />
            </div>
          </div>
        )}

        <UserList
          users={users}
          loading={loading}
          onEdit={setEditingUser}
          onDelete={handleDelete}
          dataSource={dataSource}
        />
      </main>
    </div>
  );
}

export default App;