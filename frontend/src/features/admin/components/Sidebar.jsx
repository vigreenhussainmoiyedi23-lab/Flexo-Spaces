import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Listings", path: "/admin/listings" },
    { name: "Disputes", path: "/admin/disputes" },
  ];

  return (
    <div className="w-64 bg-brand-900 border-accent-500 border-r p-5 hidden lg:block">
      <h1 className="playfair text-2xl mb-6 ">
        Admin Panel
      </h1>
      <hr className="mb-6 text-accent-500 w-full"/>
      <div className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className="block p-2 rounded hover:bg-brand-700 montserrat"
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
