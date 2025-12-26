import React from "react";

function Navbar({title, user, onLogout}) {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const initials = firstName && lastName ? firstName[0].toUpperCase() + lastName[0].toUpperCase() : "";
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-[var(--dark-bg) border-b border-[var(--dark-border)]]">
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                {title}
            </h1>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rouded-full bg-[var(--dark-card)] text-[var(--text-primary)] font-bold border border-[var(--dark-border)]">
                    {initials}
                </div>
                <span className="text-[var(--text-secondary)]">
                    {firstName} {lastName}
                </span>
                <button 
                    onClick={onLogout}
                    className="px-3 py-1 rouded border border-[var(--dark-border)] text-[var(--text-primary)] hover:bg-[var(--dark-card)] transition"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Navbar;