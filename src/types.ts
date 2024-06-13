import { SetStateAction } from "react";

export type User = {
    _id:string;
    email:string;
    firstName:string;
    lastName:string;
    password:string;
    avatar?:string;
    addressLine1?:string;
    addressLine2?:string;
    city?:string;
}

export type GlobalContextType = {
    isLoggedIn:boolean;
    setIsLoggedIn:React.Dispatch<SetStateAction<boolean>>;
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
}