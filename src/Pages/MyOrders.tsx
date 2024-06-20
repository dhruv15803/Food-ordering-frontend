import { backendUrl } from '@/App'
import MyOrderCard from '@/components/MyOrderCard';
import { Order } from '@/types';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MyOrders = () => {
    const [orders,setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/orders/getMyOrders`,{
                    withCredentials:true,
                });
                console.log(response);
                setOrders(response.data.orders);
            } catch (error) {
                console.log(error);
            }
        }
        fetchMyOrders();
    },[])
  return (
    <>
    <div className='flex flex-col w-[80%] mx-auto my-16'>
        <div className='text-xl font-semibold my-4'>Your orders</div>
        {orders?.map((order) => {
            return <MyOrderCard key={order._id} order={order}/>
        })}
    </div>
    </>
  )
}

export default MyOrders