import React, { SetStateAction } from "react";

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
    cuisines:Cuisine[];
    setCuisines:React.Dispatch<SetStateAction<Cuisine[]>>;
    cities:City[];
    setCities:React.Dispatch<SetStateAction<City[]>>;
}

export type Restaurant = {
    _id:string;
    restaurantName:string;
    restaurantCity:City;
    restaurantAddressLine1:string;
    restaurantAddressLine2:string;
    restaurantThumbnail:string;
    restaurantImages:string[];
    restaurantOwner:string;
}

export type FoodItem = {
    _id:string;
    foodItemName:string;
    foodItemDescription:string;
    foodItemPrice:number;
    foodItemCuisine:Cuisine;
    restaurantId:Restaurant;
}