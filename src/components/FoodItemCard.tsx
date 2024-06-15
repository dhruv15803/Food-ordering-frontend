import { Cuisine, FoodItem } from "@/types";
import React, { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { backendUrl } from "@/App";

type FoodItemCardProps = {
  foodItem: FoodItem;
  deleteFoodItem: (id: string) => Promise<void>;
  restaurantCuisines: Cuisine[];
  foodItems:FoodItem[];
  setFoodItems:React.Dispatch<SetStateAction<FoodItem[]>>;
};

const FoodItemCard = ({
  foodItem,
  deleteFoodItem,
  restaurantCuisines,
  foodItems,
  setFoodItems,
}: FoodItemCardProps) => {
  const [isFoodItemEdit, setIsFoodItemEdit] = useState<boolean>(false);
  const [newFoodItemName, setNewFoodItemName] = useState<string>("");
  const [newFoodItemDescription, setNewFoodItemDescription] =
    useState<string>("");
  const [newFoodItemPrice, setNewFoodItemPrice] = useState<number>(0);
  const [newFoodItemCuisine, setNewFoodItemCuisine] = useState<string>("");
  
  const toggleEdit = () => {
    if (isFoodItemEdit === false) {
      setIsFoodItemEdit(true);
      setNewFoodItemName(foodItem.foodItemName);
      setNewFoodItemDescription(foodItem.foodItemDescription);
      setNewFoodItemCuisine(foodItem.foodItemCuisine.cuisineName);
      setNewFoodItemPrice(foodItem.foodItemPrice);
    } else {
      setIsFoodItemEdit(false);
    }
  };

  const editFoodItem = async () => {
    try {
        if(newFoodItemName.trim()==="" || newFoodItemDescription.trim()==="" || newFoodItemCuisine.trim()==="" || newFoodItemPrice===0) {
            return;
        }
        const response = await axios.put(`${backendUrl}/api/foodItem/update`,{
            newFoodItemName,
            newFoodItemDescription,
            newFoodItemCuisine,
            newFoodItemPrice,
            id:foodItem._id,
        });
        const newFoodItems = foodItems.map((item) => {
            if(item._id===foodItem._id) {
                return response.data.foodItem;
            } else {
                return item;
            }
        })
        setFoodItems(newFoodItems);
        setIsFoodItemEdit(false);
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="flex p-2 border rounded-lg">
      <div className="flex flex-col w-[50%] gap-2">
        <div className="text-xl font-semibold">
          {isFoodItemEdit ? (
            <>
              <Input
                value={newFoodItemName}
                onChange={(e) => setNewFoodItemName(e.target.value)}
                type="text"
              />
            </>
          ) : (
            foodItem.foodItemName
          )}
        </div>
        <div>
          {isFoodItemEdit ? (
            <>
              <Input
                value={newFoodItemDescription}
                onChange={(e) => setNewFoodItemDescription(e.target.value)}
              />
            </>
          ) : (
            foodItem.foodItemDescription
          )}
        </div>
        <div>
          {isFoodItemEdit ? (
            <>
              {restaurantCuisines.length!==0 ?  <Select value={newFoodItemCuisine} onValueChange={(value) => setNewFoodItemCuisine(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantCuisines?.map((cuisine) => {
                    return (
                      <SelectItem key={cuisine._id} value={cuisine.cuisineName}>
                        {cuisine.cuisineName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select> : <><div className="text-red-500">Please select cuisines</div></>}
            </>
          ) : (
            foodItem.foodItemCuisine.cuisineName
          )}
        </div>
        <div className="flex items-center gap-2">
          {isFoodItemEdit ? (
            <>
              <Input
                value={newFoodItemPrice}
                onChange={(e) => setNewFoodItemPrice(Number(e.target.value))}
                type="number"
              />
            </>
          ) : (
            <>₹ {foodItem.foodItemPrice}</>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center mx-2 gap-2">
        {!isFoodItemEdit && (
          <Button
            onClick={() => deleteFoodItem(foodItem._id)}
            variant="destructive"
          >
            Delete
          </Button>
        )}
        <Button onClick={toggleEdit} variant="outline">
          {isFoodItemEdit ? "Cancel" : "Edit"}
        </Button>
        {(isFoodItemEdit && restaurantCuisines.length!==0) && <Button onClick={editFoodItem}>Update</Button>}
      </div>
    </div>
  );
};

export default FoodItemCard;
