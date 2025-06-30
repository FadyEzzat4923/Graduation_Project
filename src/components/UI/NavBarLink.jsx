/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

export default function NavBarLink({ to, cssClass, children, ...props }) {
  return (
    <NavLink
      {...props}
      to={to}
      className={`text-black duration-100 ${cssClass} ${({ isActive }) =>
        isActive ? "active" : ""}`}
    >
      {children}
    </NavLink>
  );
}
