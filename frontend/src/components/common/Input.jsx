function Input({ label, error, className = "", id, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm text-[var(--text-secondary)]">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          px-4 py-2 rounded-lg
          bg-[var(--dark-bg)]
          border
          ${error ? "border-red-500" : "border-[var(--dark-border)]"}
          text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        `}
        {...props}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

export default Input;
