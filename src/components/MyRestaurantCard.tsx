import { backendUrl } from "@/App";
import { FoodItem, Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

type MyRestaurantCardProps = {
  restaurant: Restaurant;
};

const MyRestaurantCard = ({ restaurant }: MyRestaurantCardProps) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getFoodItems = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getRestaurantFoodItems/${restaurant._id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setFoodItems(response.data.foodItems);
      } catch (error) {
        console.log(error);
      }
    };
    getFoodItems();
  }, []);

  return (
    <>
      <div onClick={() => navigate(`/restaurant/menu/${restaurant._id}`)} className="flex flex-col p-4 border-2 rounded-lg">
        <div className="text-xl font-semibold">{restaurant.restaurantName}</div>
        <div className="flex items-center gap-1">
          <CiLocationOn />
          <span>{restaurant.restaurantCity.cityName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{restaurant.restaurantAddressLine1}</span>
          <span>{restaurant.restaurantAddressLine2}</span>
        </div>
        {foodItems.length < 5 && <div className="text-red-500">incomplete</div>}
      </div>
    </>
  );
};

export default MyRestaurantCard;
