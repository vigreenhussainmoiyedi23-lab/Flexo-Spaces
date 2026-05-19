import Sidebar from "../features/admin/components/Sidebar";
import Navbar from "../features/admin/components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-brand-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="lg:p-6 p-1 sm:p-2 md:p-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
