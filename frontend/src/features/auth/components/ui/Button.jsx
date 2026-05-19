
// ================= Button.jsx =================
export const Button = ({ children,submitHandler }) => {
  return (
    <button 
    onClick={ submitHandler}
    className="bg-linear-to-br from-brand-300 to-brand-500 active:scale-95 hover:to-brand-700 from-pent to-sec text-white py-3 rounded-lg font-semibold  transition">
      {children}
    </button>
  );
};

