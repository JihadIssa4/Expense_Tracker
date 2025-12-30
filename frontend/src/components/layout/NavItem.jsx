import { NavLink } from "react-router-dom";
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-4 py-3 rounded-lg
        transition
        lg:text-[1rem] md:text-[0.8rem]
        ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-[var(--text-secondary)] hover:bg-[var(--dark-border)] hover:text-[var(--text-primary)]"
        }
        `
      }
    >
      {label}
    </NavLink>
  );
}
export default NavItem;
