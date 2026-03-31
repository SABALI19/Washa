import React from "react";
import { Link, NavLink } from "react-router-dom";
import WashaLogo from "../assets/logo/washa-logo-transparent.png";
import Button from "./Button.jsx";

const LandingPageHeader = () => {
  const Links = [
    {
      title: "Features",
      path: "/",
    },
    {
      title: "Pricing",
      path: "/pricing",
    },
    {
      title: "Support",
      path: "/support",
    },
    // {
    //   title: "Contact",
    //   path: "/contact",
    // },
  ];
  return (
    <div className="relative z-9999 w-full">
      <header className="flex w-full items-center justify-between gap-4 px-12 py-2 shadow-sm">
        <NavLink to="/" className="shrink-0">
          <img
            src={WashaLogo}
            alt="Washa Logo"
            className="h-12 w-12 object-contain"
          />
        </NavLink>

        <nav className="flex items-center justify-between font-light gap-4">
          <ul className="flex items-center gap-8 ">
            {Links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#2c4a7d] hover:text-[#2c4a7d]"
                        : "text-gray-700 hover:text-blue-500"
                    } `
                  }
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="regular"
                size="xl"
                fontWeight="thin"
                className="border-[#2c4a7d] hover:border-[#2c4a7d] focus:ring-[#2c4a7d]"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default LandingPageHeader;
