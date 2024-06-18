import { GlobalContext, backendUrl } from "@/App";
import CartItemCard from "@/components/CartItemCard";
import MenuItemCard from "@/components/MenuItemCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartItem, FoodItem, GlobalContextType, Restaurant } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantPage = () => {
  let cartData = JSON.parse(localStorage.getItem("cartData")!);
  if (cartData === null || cartData === undefined) {
    cartData = [];
  }
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(cartData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const noOfPages = Math.ceil(foodItems.length / itemsPerPage);
  const { cities, loggedInUser } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodItems.slice(indexOfFirstItem, indexOfLastItem);
  const addToCart = (item: FoodItem) => {
    // check if item already in cart
    // if already in cart  then increase quantity
    // else add cart item
    let isCartItemExists = false;
    const newCart = cart.map((cartItem) => {
      if (cartItem._id === item._id) {
        isCartItemExists = true;
        return {
          ...cartItem,
          cartItemQty: cartItem.cartItemQty + 1,
        };
      } else {
        return cartItem;
      }
    });
    if (isCartItemExists === false) {
      setCart((prev) => [
        ...prev,
        {
          _id: item._id,
          cartItemName: item.foodItemName,
          cartItemPrice: item.foodItemPrice,
          cartItemQty: 1,
        },
      ]);
      return;
    }
    setCart(newCart);
  };

  const deleteCartItem = (id: string) => {
    const newCart = cart.filter((item) => item._id !== id);
    setCart(newCart);
  };

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



  const checkout = async () => {
    try {
      console.log(city,addressLine1,addressLine2);
      if(addressLine1.trim()==="" || addressLine2.trim()==="" || city.trim()==="") {
        return;
      }
      console.log('Function');
      const response = await axios.post(`${backendUrl}/api/stripe/checkout`,{
        cart,
        restaurantId,
      })
      console.log(response);
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    }
  }


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

  useEffect(() => {
    const settingCartLocalStorage = () => {
      localStorage.setItem("cartData", JSON.stringify(cart));
    };
    settingCartLocalStorage();
  }, [cart]);

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
          <div className="mb-4 flex items-center gap-4">
            <span className="text-2xl font-semibold">
              {restaurant?.restaurantName} Menu
            </span>
            <span className="text-md text-gray-500">
              ({foodItems.length} dishes available)
            </span>
          </div>
          {currentItems?.map((item) => {
            return (
              <MenuItemCard key={item._id} item={item} addToCart={addToCart} />
            );
          })}
          {noOfPages > 1 && (
            <Pagination
              currentPage={currentPage}
              noOfPages={noOfPages}
              setCurrentPage={setCurrentPage}
            />
          )}
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
            <>
              <div className="flex items-center my-2  justify-between mx-10">
                <div className="text-2xl font-semibold">Total</div>
                <div className="text-xl">Rs {getTotalPrice()}</div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mx-2">Checkout</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter delivery details</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-1">
                    <Label>Email</Label>
                    <Input disabled={true} value={loggedInUser?.email} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="addressLine1">Enter address line 1</Label>
                    <Input
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      type="text"
                      name="addressLine1"
                      id="addressLine1"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="addressLine2">Enter address line 2</Label>
                    <Input
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      type="text"
                      name="addressLine2"
                      id="addressLine2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="city">Select city</Label>
                    <Select onValueChange={(value) => setCity(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities?.map((city) => {
                          return (
                            <SelectItem key={city._id} value={city.cityName}>
                              {city.cityName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button onClick={checkout}>Proceed to checkout</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantPage;
