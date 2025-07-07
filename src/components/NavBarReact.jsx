import {useState} from "react";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NavBarReact = ({currentPath = "/"}) => {
  const navItems = [
    {href: "/", icon: Home, label: "Inicio"},
    {href: "/users", icon: Users, label: "Usuarios"},
    {href: "/sales", icon: ShoppingCart, label: "Ventas"},
    {href: "/products", icon: Package, label: "Productos"},
    {href: "/clients", icon: UserCircle, label: "Clientes"},
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={`
        bg-gray-800 border-r border-gray-200 h-full min-h-screen
        transition-all duration-200 ease-in-out
        ${isMenuOpen ? "w-[200px]" : "w-[60px]"}
      `}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleMenu}
          className="text-gray-50 hover:text-white cursor-pointer"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <ul className="mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={`
                  flex items-center px-4 py-3
                  ${
                    isActive
                      ? "bg-gray-500 text-white"
                      : "text-gray-100 hover:bg-gray-600"
                  }
                `}
              >
                <Icon size={18} />
                {isMenuOpen && (
                  <span className="ml-4 transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBarReact;
