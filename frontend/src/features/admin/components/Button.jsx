export default function Button({ children, onClick, variant="primary" }) {
  const base = "px-3 py-1 rounded text-sm source-code-pro";

  const styles = {
    primary: "bg-accent-500 text-brand-900",
    danger: "bg-red-500 text-white",
    secondary: "bg-brand-300 text-white"
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
}