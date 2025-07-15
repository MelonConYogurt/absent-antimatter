import React, {useState, useEffect} from "react";
import {
  Menu,
  X,
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  UserCircle,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/");

  const navItems: NavItem[] = [
    {name: "Dashboard", href: "/", icon: <BarChart3 size={20} />},
    {name: "Productos", href: "/products", icon: <Package size={20} />},
    {name: "Clientes", href: "/clients", icon: <Users size={20} />},
    {name: "Ventas", href: "/sales", icon: <ShoppingCart size={20} />},
    {name: "Usuarios", href: "/users", icon: <UserCircle size={20} />},
  ];

  useEffect(() => {
    // Obtener la ruta actual en el cliente
    if (typeof window !== "undefined") {
      setActiveRoute(window.location.pathname);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return activeRoute === href;
  };

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200"
              onClick={closeMenu}
            >
              <BarChart3 size={28} className="text-white" />
              <span className="text-xl font-bold hidden sm:block">
                Sistema de Inventario
              </span>
              <span className="text-xl font-bold sm:hidden">SI</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${
                      isActiveRoute(item.href)
                        ? "bg-white/20 text-white shadow-md transform scale-105"
                        : "text-white/90 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                    }
                  `}
                  onClick={closeMenu}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200
                ${
                  isActiveRoute(item.href)
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }
              `}
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
