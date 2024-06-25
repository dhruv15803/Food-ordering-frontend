import { backendUrl } from "@/App";
import { FoodItem, Restaurant } from "@/types";
import axios from "axios";
import  { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

type MyRestaurantCardProps = {
  restaurant: Restaurant;
  removeRestaurant: (id: string) => Promise<void>;
};

const MyRestaurantCard = ({
  restaurant,
  removeRestaurant,
}: MyRestaurantCardProps) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [restaurantNameConfirm, setRestaurantNameConfirm] =
    useState<string>("");
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
      <div className="flex items-center p-4 border-2 rounded-lg">
        <div
          onClick={() => navigate(`/restaurant/menu/${restaurant._id}`)}
          className="flex flex-col w-[50%]"
        >
          <div className="text-xl font-semibold">
            {restaurant.restaurantName}
          </div>
          <div className="flex items-center gap-1">
            <CiLocationOn />
            <span>{restaurant.restaurantCity.cityName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{restaurant.restaurantAddressLine1}</span>
            <span>{restaurant.restaurantAddressLine2}</span>
          </div>
          {foodItems.length < 5 && (
            <div className="text-red-500">incomplete</div>
          )}
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Remove restaurant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to remove restaurant
                </DialogTitle>
                <DialogDescription>
                  Please type {restaurant.restaurantName} to confirm you want to
                  remove the restaurant.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={restaurantNameConfirm}
                onChange={(e) => setRestaurantNameConfirm(e.target.value)}
                type="text"
                name="restaurantNameConfirm"
                id="restaurantNameConfirm"
              />
              <DialogFooter>
                {restaurantNameConfirm === restaurant.restaurantName && (
                  <>
                    <Button onClick={() => removeRestaurant(restaurant._id)}>
                      Remove
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Button onClick={() => navigate(`/restaurant/orders/${restaurant._id}`)} className="mx-4">View orders</Button>
      </div>
    </>
  );
};

export default MyRestaurantCard;
