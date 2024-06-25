import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="flex items-center w-[80%] mx-auto mt-16 text-xl font-semibold">
        Admin panel
      </div>
      <div className="flex items-center gap-4 w-[80%] mx-auto my-4">
        <NavLink
          end
          to="."
          className={({ isActive }) =>
            isActive ? "underline underline-offset-4" : ""
          }
        >
          Manage cuisines
        </NavLink>
        <NavLink
          to="city"
          className={({ isActive }) =>
            isActive ? "underline underline-offset-4" : ""
          }
        >
          Manage cities
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default AdminLayout;
