import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { createContext, useEffect, useState } from "react";
import { GlobalContextType, User } from "./types";
import axios from "axios";
import Loader from "./components/Loader";
import Admin from "./Pages/Admin";
export const backendUrl = "http://localhost:5000";
export const GlobalContext = createContext<GlobalContextType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAdmin,setIsAdmin] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/api/auth/getLoggedInUser`,{
          withCredentials:true,
        })
        console.log(response);
        setLoggedInUser(response.data.user);
        setIsAdmin(response.data.user.isAdmin);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getLoggedInUser();
  },[])

  if(isLoading) {
    return (
      <>
      <div className="flex justify-center my-24 items-center gap-4">
        <Loader height="100" width="100"/>
        <span className="text-blue-500 text-xl">Loading...</span>
      </div>
      </>
    )
  }

  return (
    <>
      <GlobalContext.Provider value={{
        isLoggedIn,
        setIsLoggedIn,
        loggedInUser,
        setLoggedInUser,
        isAdmin,
        setIsAdmin,
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="register" element={isLoggedIn ? <Navigate to="/"/> : <Register />} />
              <Route path="login" element={isLoggedIn ? <Navigate to="/"/> : <Login />} />
              <Route path="admin" element={(isLoggedIn && isAdmin) ? <Admin/> : <Navigate to="/"/>}/>
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
