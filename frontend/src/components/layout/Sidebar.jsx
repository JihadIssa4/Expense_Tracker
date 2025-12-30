import NavItem from "./NavItem";

function Sidebar() {
  return (
    <aside
      className="
    top-0 left-0
    hidden md:block
    h-full
    bg-[var(--dark-card)]
    border-r border-[var(--dark-border)]
    p-6
  "
    >
      {" "}
      {/* Logo */}{" "}
      <div className="lg:text-[1.25rem] md:text-[0.9rem] font-bold mb-8 flex items-center gap-2 text-blue-500">
        {" "}
        💰 ExpenseTracker{" "}
      </div>{" "}
      {/* Navigation */}{" "}
      <nav className="flex flex-col gap-1">
        {" "}
        <NavItem to="/" label="📊 Dashboard" />{" "}
        <NavItem to="/expenses" label="🧾 Expenses" />{" "}
        <NavItem to="/categories" label="📁 Categories" />{" "}
        <NavItem to="/analytics" label="📈 Analytics" />{" "}
      </nav>{" "}
    </aside>
  );
}

export default Sidebar;
