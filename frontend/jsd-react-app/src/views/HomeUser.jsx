import { useEffect, useState } from "react";
import { UserTable } from "../components/UserTable";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function HomeUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/v2/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API}/v2/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center w-full bg-gray-50">
      <header className="w-full max-w-5xl flex justify-between items-center py-4 border-b mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">HomeUser Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
        >
          Logout
        </button>
      </header>

      <div className="w-full max-w-5xl mb-6">
        <h2 className="text-xl font-bold text-gray-700">User List (View / Edit Only)</h2>
        <p className="text-sm text-gray-500">You can view users and edit information, but adding/deleting is restricted to Admin.</p>
      </div>

      <main className="w-full max-w-5xl">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-500">Loading users...</div>
        ) : (
          <UserTable users={users} role="user" />
        )}
      </main>
    </div>
  );
}