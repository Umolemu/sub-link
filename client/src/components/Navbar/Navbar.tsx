import { Phone } from "lucide-react";
import { Button } from "../Button/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

// Navbar
// Uses NavLink to detect which route is active. The active link uses
// the "secondary" button variant (black background / white text).
export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b-1 border-b-gray-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-black mr-2" />
            <span className="text-xl font-bold text-black">Sublink</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* NavLink provides an isActive flag so we style the button variant accordingly */}
            <NavLink to="/dashboard" end>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  aria-current={isActive ? "page" : undefined}
                >
                  Dashboard
                </Button>
              )}
            </NavLink>
            <NavLink to="/transactions" end>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  aria-current={isActive ? "page" : undefined}
                >
                  Transactions
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  aria-current={isActive ? "page" : undefined}
                >
                  Admin
                </Button>
              )}
            </NavLink>
            <Button
              variant="ghost"
              onClick={() => { logout(); navigate("/"); }}
              className="text-black hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
