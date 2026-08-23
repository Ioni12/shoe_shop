import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    isActive ? "text-oxblood" : "hover:text-oxblood";

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-body">
      <header className="border-b border-stone-line">
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg">Kepuca e arte</span>
            <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-stamp">
              <NavLink to="/admin/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                Orders
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-stamp">
            {admin?.username && (
              <span className="hidden sm:inline text-stone">
                {admin.username}
              </span>
            )}
            <button onClick={handleLogout} className="hover:text-oxblood">
              Log out
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center gap-1 w-6 h-6"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              <span className="block h-px w-full bg-ink" />
              <span className="block h-px w-full bg-ink" />
              <span className="block h-px w-full bg-ink" />
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {menuOpen && (
          <nav className="md:hidden border-t border-stone-line px-5 py-4 flex flex-col gap-4 font-mono text-xs uppercase tracking-stamp">
            <NavLink
              to="/admin/products"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Orders
            </NavLink>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
