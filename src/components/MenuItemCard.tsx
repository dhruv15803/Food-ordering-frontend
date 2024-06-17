import { FoodItem } from "@/types";
import React from "react";
import { BiSolidDish } from "react-icons/bi";
import { Button } from "./ui/button";
import { FaShoppingCart } from "react-icons/fa";

type MenuItemCardProps = {
  item: FoodItem;
  addToCart:(item:FoodItem) => void;
};

const MenuItemCard = ({ item,addToCart}: MenuItemCardProps) => {
  return (
    <>
      <div className="flex border rounded-lg p-2 shadow-md">
        <div className="flex flex-col gap-2 w-[80%]">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold">{item.foodItemName}</span>
            <span className="text-sm text-gray-500">
              {item.foodItemDescription}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BiSolidDish />
            {item.foodItemCuisine.cuisineName}
          </div>
          <div>₹{item.foodItemPrice}</div>
        </div>
        <div className="w-[80%] flex items-center justify-center">
          <Button onClick={() => addToCart(item)} className="flex items-center gap-1">
            <span>Add to cart</span>
            <FaShoppingCart />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MenuItemCard;
