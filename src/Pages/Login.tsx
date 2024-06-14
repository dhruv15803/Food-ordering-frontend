import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginErrorMsg,setLoginErrorMsg] = useState<string>("");
  const {setIsLoggedIn,setLoggedInUser,setIsAdmin} = useContext(GlobalContext) as GlobalContextType;
  const navigate = useNavigate();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if(email.trim()==="" || password.trim()==="") {
        setLoginErrorMsg("Please enter all fields");
        setTimeout(() => {
          setLoginErrorMsg("");
        },4000)
        return;
      }
      const response = await axios.post(`${backendUrl}/api/auth/login`,{
        email,
        password,
      },{withCredentials:true});
      console.log(response);
      setIsLoggedIn(true);
      setLoggedInUser(response.data.user);
      setIsAdmin(response.data.user.isAdmin);
      navigate('/');
    } catch (error:any) {
      console.log(error);
      setLoginErrorMsg(error.response.data.message);
      setTimeout(() => {
        setLoginErrorMsg("");
      },4000)
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 w-[60%] border-2 mx-auto my-16 rounded-lg">
        <div className="text-2xl">Login</div>
        <form
          onSubmit={(e) => loginUser(e)}
          className="flex flex-col gap-4 my-4"
        >
          <div className="flex flex-col gap-2">
            <Label className="text-xl" htmlFor="email">
              Enter email
            </Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="eg:example@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xl" htmlFor="password">
              Enter password
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              name="password"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span>Show password</span>
          </div>
          <div className="text-red-500">{loginErrorMsg}</div>
          <div className="flex items-center gap-2">
            <span>Don't have an account ? </span>
            <span className="font-semibold">
              <Link to="/register">Click here</Link>
            </span>
          </div>
          <Button>Login</Button>
        </form>
      </div>
    </>
  );
};

export default Login;
