import { Order } from "@/types";
import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type MyOrderCardProps = {
  order: Order;
};

const MyOrderCard = ({ order }: MyOrderCardProps) => {
  const navigate = useNavigate();
  const [isViewOrder, setIsViewOrder] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center border rounded-lg shadow-md">
        <div className="w-[10%] border">
          <img
            src={order.restaurant.restaurantThumbnail}
            className="object-cover aspect-auto"
            alt=""
          />
        </div>
        <div className="w-[90%] flex flex-col p-4">
          <div className="text-xl font-semibold">
            {order.restaurant.restaurantName}
          </div>
          <div className="flex items-center gap-2">
            <CiLocationOn />
            <span>{order.restaurant.restaurantAddressLine1}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Status:</span>
            <span
              className={`${
                order.orderStatus === "PAID" ? "text-blue-500" : "font-semibold"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>order items: </span>
            <span>{order.orderItems.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="link" onClick={() => setIsViewOrder(!isViewOrder)}>
              {isViewOrder ? "Hide Order" : "View Order"}
            </Button>
            <Button
              onClick={() =>
                navigate(`/restaurant/results/menu/${order.restaurant._id}`)
              }
              variant="link"
            >
              View menu
            </Button>
          </div>
          {isViewOrder && (
            <div className="flex flex-col">
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
                    <div className="flex flex-wrap">
                      ₹ {orderItem.orderItemPrice}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrderCard;
