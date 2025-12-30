function Card({ children, className = "" }) {
  return (
    <div
      className={`
                bg-[var(--dark-card)]
                border border-[var(--dark-border)]
                rounded-xl
                p-6
                ${className}
            `}
    >
      {children}
    </div>
  );
}

export default Card;
