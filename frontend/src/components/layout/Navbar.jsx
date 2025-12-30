import React from "react";

function Navbar({ title, user, onLogout }) {
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const initials =
    firstName && lastName
      ? firstName[0].toUpperCase() + lastName[0].toUpperCase()
      : "";
  return (
    <nav className="flex items-center justify-between mt-5 mr-6 p-4 bg-[var(--dark-card)] rounded-xl border border-[var(--dark-border)]">
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-5">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#3b82f6,#8b5cf6)]
 text-[var(--text-primary)] font-bold"
        >
          {initials}
        </div>

        <span className="text-[var(--text-primary)] font-bold">
          {firstName} {lastName}
        </span>

        <button
          onClick={onLogout}
          className="text-md px-3 py-1 rounded border border-[var(--dark-border)] text-[var(--text-primary)] hover:bg-red-600 hover:border-red-600 cursor-pointer transition duration-350"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
