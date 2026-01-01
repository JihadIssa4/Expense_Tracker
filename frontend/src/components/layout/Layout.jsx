import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  //const { user } = useContext(AuthContext);

  useEffect(() => {}, [location.pathname]);
  const titles = {
    "/dashboard": "Dashboard",
    "/expenses": "Expenses",
    "/categories": "Categories",
    "/analytics": "Analytics",
  };
  const title = titles[location.pathname] || "";

  return (
    <div className="min-h-screen grid md:grid-cols-[20%_80%] gap-4 bg-[var(--dark-bg)]">
      {/* Sidebar: 20% */}
      <aside>
        <Sidebar />
      </aside>

      {/* Right side: 80% */}
      <div className="mt-5 mr-6">
        <Navbar title={title} user={user} onLogout={logout} />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
