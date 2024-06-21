import { Order } from "@/types";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { backendUrl } from "@/App";

type RestaurantOrderCardProps = {
  order: Order;
  restaurantOrders:Order[];
  setRestaurantOrders:React.Dispatch<SetStateAction<Order[]>>;
};

type orderStatusType =
  | "PLACED"
  | "PAID"
  | "FAILED"
  | "inProgress"
  | "outForDelivery"
  | "delivered";

const RestaurantOrderCard = ({ order ,restaurantOrders,setRestaurantOrders}: RestaurantOrderCardProps) => {
  const [orderStatus, setOrderStatus] = useState<orderStatusType>(
    order.orderStatus
  );
  const statusArr = [
    "PLACED",
    "PAID",
    "FAILED",
    "inProgress",
    "outForDelivery",
    "delivered",
  ];

  useEffect(() => {
    const updateOrderStatus = async () => {
        try {
            if(orderStatus===order.orderStatus) return;
            const response = await axios.post(`${backendUrl}/api/orders/updateOrderStatus`,{
                id:order._id,
                orderStatus,
            },{withCredentials:true});
            console.log(response);
            const updatedOrders = restaurantOrders.map((item) => {
                if(item._id===order._id) {
                    return response.data.updatedOrder;
                } else {
                    return item;
                }
            });
            setRestaurantOrders(updatedOrders);
        } catch (error) {
            console.log(error);
        }
    }
    updateOrderStatus();
  },[orderStatus])

  return (
    <>
      <div className="flex flex-col  border rounded-lg shadow-md p-4">
        <div className="flex items-center gap-1 text-md font-thin">
          <span>id:</span>
          <span> {order._id}</span>
        </div>
        {order.orderItems.map((orderItem, i) => {
          return (
            <div key={i} className="flex items-center border-b p-2">
              <div className="font-semibold w-[50%] flex flex-wrap">
                {orderItem.orderItemName}
              </div>
              <div className="flex flex-wrap w-[30%] items-center gap-2">
                <span className="text-gray-500">Qty</span>
                <span>{orderItem.orderItemQty}</span>
              </div>
              <div className="flex flex-wrap">₹ {orderItem.orderItemPrice}</div>
            </div>
          );
        })}
        <div className="flex items-center my-2 gap-2">
          <span>Change order status</span>
          <Select
            value={order.orderStatus}
            onValueChange={(value: orderStatusType) => setOrderStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="choose status" />
            </SelectTrigger>
            <SelectContent>
              {statusArr.map((status,i) => {
                return <SelectItem key={i} value={status}>{status}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default RestaurantOrderCard;
