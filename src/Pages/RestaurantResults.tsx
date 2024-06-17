import { backendUrl } from "@/App";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantResults = () => {
  const { restaurantCity } = useParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurantsByCity = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getRestaurantsByCity/${restaurantCity}`
        );
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRestaurantsByCity();
  }, [restaurantCity]);

  return (
    <>
      <div className="flex gap-4 border-2 m-16">
        <div className="w-[20%]">Left</div>
        <div className="flex flex-col border-2  w-[80%]">
          <div className="flex flex-col gap-1 my-8">
            <div className="text-xl font-semibold">
              Restaurants in {restaurantCity}
            </div>
            <div>{restaurants.length} restaurants found</div>
          </div>
          <div className="flex flex-col gap-2">
            {restaurants?.map((restaurant) => {
                return <RestaurantCard key={restaurant._id} restaurant={restaurant}/>
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantResults;
