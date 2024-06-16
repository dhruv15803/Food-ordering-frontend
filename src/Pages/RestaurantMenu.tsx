import { GlobalContext, backendUrl } from "@/App";
import CuisineCheckbox from "@/components/CuisineCheckbox";
import FoodItemCard from "@/components/FoodItemCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Cuisine, FoodItem, GlobalContextType, Restaurant } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const RestaurantMenu = () => {
  const { restaurantId } = useParams();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const { cuisines } = useContext(GlobalContext) as GlobalContextType;
  const [restaurantCuisines, setRestaurantCuisines] = useState<Cuisine[]>([]);
  const [foodItemName, setFoodItemName] = useState<string>("");
  const [foodItemDescription, setFoodItemDescription] = useState<string>("");
  const [foodItemPrice, setFoodItemPrice] = useState<number>(0);
  const [foodItemCuisine, setFoodItemCuisine] = useState<string>("");
  const navigate = useNavigate();

  const addFoodItem = async () => {
    try {
      if (
        foodItemName.trim() === "" ||
        foodItemDescription.trim() === "" ||
        foodItemCuisine.trim() === "" ||
        foodItemPrice === 0
      ) {
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/foodItem/add`,
        {
          foodItemName,
          foodItemDescription,
          foodItemPrice,
          foodItemCuisine,
          restaurantId: selectedRestaurant?._id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setFoodItems((prev) => [...prev, response.data.newFoodItem]);
      setFoodItemName("");
      setFoodItemDescription("");
      setFoodItemCuisine("");
      setFoodItemPrice(0);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFoodItem = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/foodItem/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newFoodItems = foodItems.filter((item) => item._id !== id);
      setFoodItems(newFoodItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getRestaurantById = async () => {
      const response = await axios.get(
        `${backendUrl}/api/restaurant/getRestaurantById/${restaurantId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setSelectedRestaurant(response.data.restaurant);
    };
    getRestaurantById();
  }, [restaurantId]);

  useEffect(() => {
    const getFoodItems = async () => {
      try {
        if (selectedRestaurant === null) {
          return;
        }
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getRestaurantFoodItems/${selectedRestaurant?._id}`,
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
  }, [selectedRestaurant]);

  if (selectedRestaurant === null) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-col w-[80%] mx-auto my-16">
        <div className="text-xl font-semibold my-2">
          {selectedRestaurant.restaurantName} Menu
        </div>
        {foodItems.length < 5 && <div className="text-red-500 font-semibold">
          Add atleast 5 menu items to be displayed to customers
        </div> }
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">
            Select cuisines for menu items
          </div>
          <div className="flex flex-wrap gap-2 items-center my-2">
            {cuisines?.map((cuisine) => {
              return (
                <CuisineCheckbox
                  key={cuisine._id}
                  cuisine={cuisine}
                  restaurantCuisines={restaurantCuisines}
                  setRestaurantCuisines={setRestaurantCuisines}
                />
              );
            })}
          </div>
        </div>
        {foodItems.length === 0 ? (
          <div className="flex items-center gap-2 my-4 justify-center text-xl font-semibold">
            No menu items
          </div>
        ) : (
          <>
            {foodItems?.map((foodItem) => {
              return (
                <FoodItemCard
                  foodItems={foodItems}
                  setFoodItems={setFoodItems}
                  key={foodItem._id}
                  foodItem={foodItem}
                  deleteFoodItem={deleteFoodItem}
                  restaurantCuisines={restaurantCuisines}
                />
              );
            })}
          </>
        )}
        <div className="flex items-center justify-end my-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogHeader>Add menu item</DialogHeader>
              </DialogHeader>
              <div className="flex flex-col gap-1">
                <Label htmlFor="foodItemName">Enter item name</Label>
                <Input
                  value={foodItemName}
                  onChange={(e) => setFoodItemName(e.target.value)}
                  type="text"
                  name="foodItemName"
                  id="foodItemName"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="foodItemDescription">
                  Enter item description
                </Label>
                <Input
                  value={foodItemDescription}
                  onChange={(e) => setFoodItemDescription(e.target.value)}
                  type="text"
                  name="foodItemDescription"
                  id="foodItemDescription"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="foodItemPrice">Enter item price</Label>
                <Input
                  value={foodItemPrice}
                  onChange={(e) => setFoodItemPrice(Number(e.target.value))}
                  type="number"
                  name="foodItemPrice"
                  id="foodItemPrice"
                />
              </div>
              {restaurantCuisines.length === 0 ? (
                <>
                  <div className="flex items-center">
                    Please select your restaurant's cuisines
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="foodItemCuisine">Select item cuisine</Label>
                  <Select
                    onValueChange={(value: string) => setFoodItemCuisine(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurantCuisines?.map((cuisine) => {
                        return (
                          <SelectItem
                            key={cuisine._id}
                            value={cuisine.cuisineName}
                          >
                            {cuisine.cuisineName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {restaurantCuisines.length !== 0 && (
                <DialogFooter>
                  <Button onClick={addFoodItem} type="submit">
                    Add item
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
        {foodItems.length >= 5 && (
          <div className="flex items-center my-4 justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Finish</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restaurant registered</AlertDialogTitle>
                  <AlertDialogDescription>The restaurant is displayed to customers. Congratulations</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={() => navigate('/restaurant/manage')}>Next</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantMenu;
