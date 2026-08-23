import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, PackageSearch } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-stone-line transition-all duration-300 ${
        scrolled ? "min-h-16" : "min-h-24"
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-4 sm:px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-16" : "h-24"
        }`}
      >
        {/* Brand wordmark */}
        <NavLink
          to="/"
          className="group flex flex-col justify-center min-w-0"
          aria-label="Këpucë e Artë, home"
        >
          <span
            className={`font-display tracking-tight leading-none text-ink group-hover:text-brass transition-all duration-300 truncate ${
              scrolled
                ? "text-xl sm:text-2xl"
                : "text-2xl sm:text-3xl md:text-4xl"
            }`}
          >
            Këpucë e Artë
          </span>
          {/* Stamped double rule */}
          <span
            className={`block transition-all duration-300 ${
              scrolled
                ? "mt-1 max-w-[140px] sm:max-w-[180px]"
                : "mt-1.5 max-w-[220px] sm:max-w-[300px]"
            }`}
          >
            <span className="block h-[1.5px] bg-ink" />
            <span className="block h-px bg-ink mt-[3px] opacity-60" />
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-sm uppercase tracking-stamp shrink-0">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `pb-1 border-b-2 transition-colors duration-300 whitespace-nowrap ${
                  isActive
                    ? "border-brass text-brass"
                    : "border-stone-line text-ink hover:border-brass hover:text-brass"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: track order + cart + mobile menu toggle */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Track order — small secondary link, desktop only */}
          <NavLink
            to="/track-order"
            className={({ isActive }) =>
              `hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-stamp transition-colors duration-300 ${
                isActive ? "text-brass" : "text-stone hover:text-brass"
              }`
            }
            aria-label="Track your order"
          >
            <PackageSearch size={16} strokeWidth={1.75} />
            <span className="hidden lg:inline">Track order</span>
          </NavLink>

          <NavLink
            to="/cart"
            className="relative flex items-center gap-2 font-mono text-sm uppercase tracking-stamp text-ink hover:text-brass transition-colors duration-300 p-1.5"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <span className="relative">
              <ShoppingBag size={22} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brass text-ink min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 font-mono text-[10px] leading-none">
                  {itemCount}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </NavLink>

          {/* Hamburger toggle - mobile only */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 shrink-0 text-ink"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X size={24} strokeWidth={1.75} />
            ) : (
              <Menu size={24} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav - collapsible */}
      <nav
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out font-mono text-xs uppercase tracking-stamp border-t border-stone-line ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `pb-0.5 border-b transition-colors duration-300 ${
                  isActive
                    ? "border-brass text-brass"
                    : "border-transparent text-stone hover:border-brass hover:text-brass"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Track order — separated, secondary styling */}
          <NavLink
            to="/track-order"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-1.5 pt-3 mt-1 border-t border-stone-line w-full justify-center transition-colors duration-300 ${
                isActive ? "text-brass" : "text-stone hover:text-brass"
              }`
            }
          >
            <PackageSearch size={14} strokeWidth={1.75} />
            Track order
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
