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

export type Cuisine = {
    _id:string;
    cuisineName:string;
}

export type City = {
    _id:string;
    cityName:string;
}

export type GlobalContextType = {
    isLoggedIn:boolean;
    setIsLoggedIn:React.Dispatch<SetStateAction<boolean>>;
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
    isAdmin:boolean;
    setIsAdmin:React.Dispatch<SetStateAction<boolean>>;
}