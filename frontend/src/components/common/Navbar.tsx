import { NavLink } from "react-router-dom";
import ProductsDropdown from "../../features/landing/components/shared/ProductsDropdown";

export default function Navbar() {
  return (
    <nav className="text-gray-700">
      <ul className="flex gap-6 sm:gap-10 lg:gap-28">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold"
                : "hover:text-primary transition-colors"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <ProductsDropdown />
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold"
                : "hover:text-primary transition-colors"
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
