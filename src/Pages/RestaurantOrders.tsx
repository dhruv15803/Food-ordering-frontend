import { backendUrl } from '@/App';
import RestaurantOrderCard from '@/components/RestaurantOrderCard';
import { Order } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RestaurantOrders = () => {
    const {restaurantId} = useParams();
    const [restaurantOrders,setRestaurantOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getRestaurantOrders = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/orders/getRestaurantOrders/${restaurantId}`);
                console.log(response);
                setRestaurantOrders(response.data.restaurantOrders);
            } catch (error) {
                console.log(error);
            }
        }
        getRestaurantOrders();
    },[restaurantId])
  return (
    <>
        <div className='flex flex-col w-[80%] mx-auto my-16'>
            <div className='text-xl font-semibold my-2'>{restaurantOrders[0]?.restaurant?.restaurantName}</div>
            {restaurantOrders?.map((order) => {
                return <RestaurantOrderCard key={order._id} order={order} restaurantOrders={restaurantOrders} setRestaurantOrders={setRestaurantOrders}/>
            })}
        </div>
    </>
)
}

export default RestaurantOrders;
