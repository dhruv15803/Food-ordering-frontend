import { Restaurant } from "@/types";
import React from "react";
import { CiLocationOn } from "react-icons/ci";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <div className="flex border rounded-lg shadow-md p-2 gap-4">
      <div className="w-[20%]">
        <img src={restaurant.restaurantThumbnail} alt="" />
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-semibold">{restaurant.restaurantName}</div>
        <div className="flex items-center gap-1">
          <CiLocationOn />
          <span>{restaurant.restaurantCity.cityName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{restaurant.restaurantAddressLine1}</span>
          <span>{restaurant.restaurantAddressLine2}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
