import { useContext } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext, backendUrl } from "@/App";
import { GlobalContextType } from "@/types";
import { RxAvatar } from "react-icons/rx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, isLoggedIn, setLoggedInUser, loggedInUser,isAdmin} =
    useContext(GlobalContext) as GlobalContextType;

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(response);
      setIsLoggedIn(false);
      setLoggedInUser(null);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="flex items-center px-8 py-4 justify-between border-b-2">
        <div className="font-semibold text-2xl">
          <Link to="/">YummyEats</Link>
        </div>
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    <div className="text-3xl">
                      <RxAvatar />
                    </div>
                    {loggedInUser?.firstName}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('restaurant/manage')}>Manage restaurant</DropdownMenuItem>
                    {isAdmin && <DropdownMenuItem onClick={() => navigate('/admin')}>Admin panel</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => navigate('/orders')}>Your Orders</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logoutUser}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/login")} variant="outline">
              Login
            </Button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
