import { toast } from "react-toastify";

const baseConfig = {
  position: "top-right",
  autoClose: 4000,
};

const toastConfig = {
  success: { style: { backgroundColor: "green", color: "#fff" } },
  error: { style: { backgroundColor: "red", color: "#fff" } },
  info: { style: { backgroundColor: "lightblue", color: "var(--color-brand-900)" } },
  warning: { style: { backgroundColor: "orange", color: "yellow" } },
  default: { style: { backgroundColor: "var(--color-brand-700)", color: "#fff" } },
};

// ✅ normal toast (same as yours but cleaner)
 const showToast = (message, type = "default") => {
  const config = toastConfig[type] || toastConfig.default;

  toast(message, {
    ...baseConfig,
    ...config,
  });
};

// ✅ NEW: loading toast
export const showLoadingToast = (message = "Loading...") => {
  return toast.loading(message, {
    position: "top-right",
  });
};

// ✅ NEW: update toast
export const updateToast = (toastId, message, type = "success") => {
  const config = toastConfig[type] || toastConfig.default;

  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 3000,
    ...config,
  });
};
export default showToast