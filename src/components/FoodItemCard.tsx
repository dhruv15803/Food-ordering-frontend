import { FoodItem } from '@/types'
import React from 'react'

type FoodItemCardProps = {
    foodItem:FoodItem;
}

const FoodItemCard = ({foodItem}:FoodItemCardProps) => {
  return (
    <div className='flex items-center p-2 border rounded-lg'>
        <div className='flex flex-col w-[50%]'>
            <div className='text-xl font-semibold'>{foodItem.foodItemName}</div>
            <div>{foodItem.foodItemDescription}</div>
            <div>{foodItem.foodItemCuisine.cuisineName}</div>
            <div className='flex items-center gap-2'>₹ {foodItem.foodItemPrice}</div>
        </div>
    </div>
  )
}

export default FoodItemCard;