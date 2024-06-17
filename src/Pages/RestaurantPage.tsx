import { backendUrl } from "@/App";
import CartItemCard from "@/components/CartItemCard";
import MenuItemCard from "@/components/MenuItemCard";
import { CartItem, FoodItem, Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => [
      ...prev,
      {
        _id: item._id,
        cartItemName: item.foodItemName,
        cartItemPrice: item.foodItemPrice,
        cartItemQty: 1,
      },
    ]);
  };

  const deleteCartItem = (id:string) => {
    const newCart = cart.filter((item) => item._id!==id);
    setCart(newCart);
  }

  const incrementQty = (id: string) => {
    const newCart = cart.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          cartItemQty: item.cartItemQty + 1,
        };
      } else {
        return item;
      }
    });
    setCart(newCart);
  };

  const decrementQty = (id: string) => {
    const newCart = cart.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          cartItemQty: item.cartItemQty - 1,
        };
      } else {
        return item;
      }
    });
    setCart(newCart);
  };

  const getTotalPrice = () => {
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
      sum = sum + cart[i].cartItemPrice * cart[i].cartItemQty;
    }
    return sum;
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
      setRestaurant(response.data.restaurant);
    };
    getRestaurantById();
  }, [restaurantId]);

  useEffect(() => {
    const getFoodItems = async () => {
      try {
        if (restaurant === null) {
          return;
        }
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getRestaurantFoodItems/${restaurant?._id}`,
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
  }, [restaurant]);

  return (
    <>
      <div className="border mx-10 my-16">
        <img
          src={restaurant?.restaurantThumbnail}
          className="w-full h-96 object-contain"
          alt=""
        />
      </div>
      <div className="flex">
        <div className="flex flex-col w-[60%] mx-20">
          <div className="text-2xl font-semibold mb-4">
            {restaurant?.restaurantName} Menu
          </div>
          {foodItems?.map((item) => {
            return (
              <MenuItemCard key={item._id} item={item} addToCart={addToCart} />
            );
          })}
        </div>
        <div className="flex flex-col w-[40%]">
          <div className="text-xl font-semibold">Cart</div>
          {cart.length !== 0 ? (
            <div className="flex flex-col border rounded-lg p-2 shadow-md my-8">
              {cart?.map((item) => {
                return (
                  <CartItemCard
                    deleteCartItem={deleteCartItem}
                    key={item._id}
                    item={item}
                    incrementQty={incrementQty}
                    decrementQty={decrementQty}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center my-4">
              <span className="text-gray-500">cart has no items</span>
            </div>
          )}
          {cart.length !== 0 && (
            <div className="flex items-center my-2  justify-between mx-10">
              <div className="text-2xl font-semibold">Total</div>
              <div className="text-xl">Rs {getTotalPrice()}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantPage;
