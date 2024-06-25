import { Restaurant } from "@/types";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
    const navigate = useNavigate();
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
        <Button onClick={() => navigate(`/restaurant/results/menu/${restaurant._id}`)} variant="outline">Menu</Button>
      </div>
    </div>
  );
};

export default RestaurantCard;
