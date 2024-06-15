import { backendUrl } from '@/App';
import { Restaurant } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const RestaurantMenu = () => {
    const {restaurantId} = useParams();
    const [selectedRestaurant,setSelectedRestaurant] = useState<Restaurant | null>(null);

    useEffect(() => {
        const getRestaurantById = async () => {
            const response = await axios.get(`${backendUrl}/api/restaurant/getRestaurantById/${restaurantId}`,{
                withCredentials:true,
            })
            console.log(response);
            setSelectedRestaurant(response.data.restaurant);
        }
        getRestaurantById();
    },[restaurantId])

    if(selectedRestaurant===null) {
        return <></>
    }

    return (
        <>
        <div className='flex flex-col w-[80%] mx-auto my-16'>
            <div className='text-xl font-semibold'>{selectedRestaurant.restaurantName} Menu</div>
        </div>
        </>
  )
}

export default RestaurantMenu