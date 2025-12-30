import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

function Layout() {
  const location = useLocation();
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
  }, [location.pathname]);
  const titles = {
    "/": "Dashboard",
    "/expenses": "Expenses",
    "/categories": "Categories",
    "/analytics": "Analytics",
  };
  const title = titles[location.pathname] || "";

  const user = {
    firstName: "Jihad",
    lastName: "Issa",
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };
  return (
    <div className="min-h-screen grid md:grid-cols-[20%_80%] gap-4 bg-[var(--dark-bg)]">
      {/* Sidebar: 20% */}
      <aside>
        <Sidebar />
      </aside>

      {/* Right side: 80% */}
      <div className="mt-5 mr-6">
        <Navbar title={title} user={user} onLogout={handleLogout} />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
