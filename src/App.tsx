import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { createContext, useEffect, useState } from "react";
import { City, Cuisine, GlobalContextType, User } from "./types";
import axios from "axios";
import Loader from "./components/Loader";
import Admin from "./Pages/Admin";
import AdminLayout from "./Layout/AdminLayout";
import AdminCity from "./Pages/AdminCity";
import RestaurantRegister from "./Pages/RestaurantRegister";
import ManageRestaurant from "./Pages/ManageRestaurant";
import RestaurantMenu from "./Pages/RestaurantMenu";
import RestaurantResults from "./Pages/RestaurantResults";
import RestaurantPage from "./Pages/RestaurantPage";
import MyOrders from "./Pages/MyOrders";
export const backendUrl = "http://localhost:5000";
export const GlobalContext = createContext<GlobalContextType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<City[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [isCheckoutLogin,setIsCheckoutLogin] = useState<boolean>(false);
  const [checkoutRestaurantId,setCheckoutRestaurantId] = useState<string>("");


  const getLoggedInUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/auth/getLoggedInUser`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      setIsAdmin(response.data.user.isAdmin);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCuisines = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/getAllCuisines`
      );
      setCuisines(response.data.cuisines);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/getAllCities`);
      setCities(response.data.cities);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCities();
    fetchCuisines();
    getLoggedInUser();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center my-24 items-center gap-4">
          <Loader height="100" width="100" />
          <span className="text-blue-500 text-xl">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalContext.Provider
        value={{
          isLoggedIn,
          setIsLoggedIn,
          loggedInUser,
          setLoggedInUser,
          isAdmin,
          setIsAdmin,
          cuisines,
          setCuisines,
          cities,
          setCities,
          isCheckoutLogin,
          setIsCheckoutLogin,
          checkoutRestaurantId,
          setCheckoutRestaurantId,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="register"
                element={isLoggedIn ? <Navigate to="/" /> : <Register />}
              />
              <Route
                path="login"
                element={isLoggedIn ? <Navigate to="/" /> : <Login />}
              />
              <Route path="admin" element={<AdminLayout />}>
                <Route
                  index
                  element={
                    isLoggedIn && isAdmin ? <Admin /> : <Navigate to="/" />
                  }
                />
                <Route
                  path="city"
                  element={
                    isLoggedIn && isAdmin ? <AdminCity /> : <Navigate to="/" />
                  }
                />
              </Route>
              <Route path="restaurant/manage" element={<ManageRestaurant />} />
              <Route
                path="restaurant/register"
                element={<RestaurantRegister />}
              />
              <Route
                path="restaurant/menu/:restaurantId"
                element={<RestaurantMenu />}
              />
              <Route
                path="restaurant/results/:restaurantCity"
                element={<RestaurantResults />}
              />
              <Route
                path="restaurant/results/menu/:restaurantId"
                element={<RestaurantPage />}
              />
              <Route path="orders" element={<MyOrders/>}/>
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
