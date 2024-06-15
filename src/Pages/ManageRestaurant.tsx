import { backendUrl } from "@/App";
import Loader from "@/components/Loader";
import MyRestaurantCard from "@/components/MyRestaurantCard";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageRestaurant = () => {
  const navigate = useNavigate();
  const [myRestaurants, setMyRestaurants] = useState<Restaurant[]>([]);
  const [isRestaurantsLoading, setIsRestaurantsLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const getMyRestaurants = async () => {
      try {
        setIsRestaurantsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getMyRestaurants`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setMyRestaurants(response.data.myRestaurants);
      } catch (error) {
        console.log(error);
      } finally {
        setIsRestaurantsLoading(false);
      }
    };
    getMyRestaurants();
  }, []);

  if (isRestaurantsLoading) {
    return (
      <>
        <div className="flex items-center justify-center my-20 gap-2">
          <Loader height="80" width="80" />
          <span className="text-blue-500 font-semibold">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex  w-[80%] mx-auto mt-16 flex-col">
        <div className="flex items-center my-4 text-xl">Manage Restaurant</div>
        {myRestaurants.length !== 0 ? (
          <>
            {myRestaurants?.map((restaurant) => {
              return (
                <MyRestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              );
            })}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <span> You have no registered restaurants </span>
              <Link to="/restaurant/register">Click here to register</Link>
            </div>
          </>
        )}
        <div className="flex justify-end my-4">
          <Button onClick={() => navigate("/restaurant/register")}>
            Register restaurant
          </Button>
        </div>
      </div>
    </>
  );
};

export default ManageRestaurant;
