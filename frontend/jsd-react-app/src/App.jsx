import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import HomeUser from "./views/HomeUser";
import HomeAdmin from "./views/HomeAdmin";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // Check auth on startup
  useEffect(() => {
    fetch("/api/users/auth", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.data || null);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  if (!user) {
    return <LoginForm onAuth={() => {}} isLogin={true} />;
  }

  const routes = useRoutes([
    { path: "/", element: <div>Logged in as {user.username} ({user.role})</div> },

    // Home routes based on role
    {
      path: "/homeuser",
      element: user.role === "user" ? <HomeUser /> : null,
    },
    {
      path: "/homeadmin",
      element: user.role === "admin" ? <HomeAdmin /> : null,
    },

    // Fallback route - redirect to home
    { path: "/*", element: <div>Loading...</div> },
  ]);

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;