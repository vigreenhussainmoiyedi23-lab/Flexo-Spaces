// components/ui/Input.jsx
import React from "react";

const Input = ({ label, name, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-text-secondary montserrat">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required
        className="px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-400"
      />
    </div>
  );
};

export default Input;