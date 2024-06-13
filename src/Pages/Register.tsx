import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [passwordRequirements, setPasswordRequirements] = useState<string[]>(
    []
  );
  const [registerErrorMsg, setRegisterErrorMsg] = useState<string>("");
  const {setLoggedInUser,setIsLoggedIn} = useContext(GlobalContext) as GlobalContextType;
  const navigate = useNavigate();

  // validate password requirements:-
  // minimum length 6
  // atleast 1 special char
  // atleast 1 numerical char
  // atleast 1 uppercase char

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // check all fields
      if (
        email.trim() === "" ||
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === ""
      ) {
        setRegisterErrorMsg("Please enter all fields");
        setTimeout(() => {
          setRegisterErrorMsg("");
        }, 4000);
        return;
      }
      // if here then all fields available.
      // compare passwords.
      if (password !== confirmPassword) {
        setRegisterErrorMsg("Please enter the same passwords");
        setTimeout(() => {
          setRegisterErrorMsg("");
        }, 4000);
        return;
      }
      console.log(password);
      let temp: string[] = [];
      setPasswordRequirements([]);
      // check password conditions.
      // 1. minimum length 6.
      if (password.length < 6) {
        temp.push("Password should be of minimum 6 length");
      }
      // 2.atleast 1 special char
      let specialChars = "!@#$%&";
      let isSpecial = false;
      for (let i = 0; i < specialChars.length; i++) {
        if (password.includes(specialChars.charAt(i))) {
          isSpecial = true;
          break;
        }
      }
      if (!isSpecial) {
        temp.push("Password should have atleast 1 special char");
      }
      // 3.atleast 1 numerical char
      let numericalChars = "0123456789";
      let isNum = false;
      for (let i = 0; i < numericalChars.length; i++) {
        if (password.includes(numericalChars.charAt(i))) {
          isNum = true;
          break;
        }
      }
      if (!isNum) {
        temp.push("Password should have atleast 1 numerical char");
      }
      // 4.Atleast 1 uppercase char
      let isUppercase = false;
      for (let i = 0; i < password.length; i++) {
          if(specialChars.includes(password.charAt(i)) || numericalChars.includes(password.charAt(i))) {
              continue;
          } 
          if (password.charAt(i).toUpperCase() === password.charAt(i)){
              isUppercase = true;
              break;
          }
      }
      if (!isUppercase) {
        temp.push("Password should have atleast 1 uppercase char");
      }
  
      if (temp.length !== 0){
          setPasswordRequirements(temp);
          return;
      }
      // if here then all good with input fields and password.
      // api request to backend to register user (POST REQ)
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          email,
          firstName,
          lastName,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setLoggedInUser(response.data.newUser);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error:any) {
      console.log(error);
      setRegisterErrorMsg(error.response.data.message);
      setTimeout(() => {
        setRegisterErrorMsg("");
      },4000)
    }
  };

  return (
    <>
      <div className="flex flex-col w-[60%] p-4 mx-auto border-2 rounded-lg my-16">
        <div className="text-2xl">Register</div>
        <form
          onSubmit={(e) => registerUser(e)}
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
            <Label className="text-xl" htmlFor="firstName">
              Enter first name
            </Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              name="firstName"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xl" htmlFor="lastName">
              Enter last name
            </Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              name="lastName"
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
          <div className="flex flex-col gap-2">
            <Label className="text-xl" htmlFor="confirmPassword">
              Confirm password
            </Label>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              name="confirmPassword"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span>Show password</span>
          </div>
          {registerErrorMsg!=="" && <div className="text-red-500 font-semibold">{registerErrorMsg}</div>}
          {passwordRequirements.length!==0 && <ul>
            {passwordRequirements?.map((msg, i) => {
              return (
                <li className="text-red-500 font-semibold" key={i}>
                  {msg}
                </li>
              );
            })}
          </ul>}
          <div className="flex items-center gap-2">
            <span>Already have an account ? </span>
            <span className="font-semibold">
              <Link to="/login">Click here</Link>
            </span>
          </div>
          <Button>Register</Button>
        </form>
      </div>
    </>
  );
};

export default Register;
