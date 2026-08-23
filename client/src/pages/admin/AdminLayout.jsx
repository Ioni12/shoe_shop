import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-body">
      <header className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg">
              Marlow &amp; Sole — Admin
            </span>
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-stamp">
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  isActive ? "text-oxblood" : "hover:text-oxblood"
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  isActive ? "text-oxblood" : "hover:text-oxblood"
                }
              >
                Orders
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-stamp">
            {admin?.username && (
              <span className="text-stone">{admin.username}</span>
            )}
            <button onClick={handleLogout} className="hover:text-oxblood">
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
