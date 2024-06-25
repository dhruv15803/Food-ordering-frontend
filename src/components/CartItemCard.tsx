import { CartItem } from "@/types";
import {FaTrash } from "react-icons/fa";

type CartItemCardProps = {
  item: CartItem;
  incrementQty:(id:string) => void;
  decrementQty:(id:string) => void;
  deleteCartItem:(id:string) => void;
};

const CartItemCard = ({ item ,incrementQty,decrementQty,deleteCartItem}: CartItemCardProps) => {

  return (
    <div className="flex flex-col border-b p-1">
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap w-[60%] items-center gap-1">
          <span className="text-xl">{item.cartItemName}</span>
          <span>({item.cartItemQty }x)</span>
        </div>
        <div className="text-md">₹{item.cartItemPrice * item.cartItemQty}</div>
        <button onClick={() => deleteCartItem(item._id)} className="text-xl text-red-500">
          <FaTrash />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button disabled={item.cartItemQty<=1} onClick={() => decrementQty(item._id)} className="border rounded-full p-2 border-black hover:bg-blue-200 hover:duration-300">
          -
        </button>
        {item.cartItemQty}
        <button onClick={() => incrementQty(item._id)} className="border rounded-full p-2 border-black hover:bg-blue-200 hover:duration-300">
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
