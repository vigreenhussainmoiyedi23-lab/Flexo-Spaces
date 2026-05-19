import Button from "../components/Button";
import useAdmin from "../hooks/useAdmin";
import { useEffect } from "react";

export default function Users() {
  const { GetAllUsersHandler, users, loading, BanOrUnbanUserHandler } =
    useAdmin();
  useEffect(() => {
    GetAllUsersHandler();
  }, []);
  if (loading)
    return (
      <div className="bg-brand-900 text-5xl flex items-center justify-center animate-pulse min-h-screen w-full text-white ">
        loading...
      </div>
    );
  return (
    <div>
      <h1 className="playfair text-3xl mb-6">Users</h1>

      <div className="p-4 rounded flex bg-brand-800 flex-col gap-3 text-black">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex bg-accent-500 rounded-lg  justify-between p-3 border-b"
          >
            <div>
              <p className="montserrat">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <Button
              onClick={() => {
                BanOrUnbanUserHandler(user._id);
              }}
              variant={user.isBanned ? "secondary" : "danger"}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </Button>
          </div>
        ))}
        {users.length == 0 && <p className="text-center text-white">No users</p>}
      </div>
    </div>
  );
}
