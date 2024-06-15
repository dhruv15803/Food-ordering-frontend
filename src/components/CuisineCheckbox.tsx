import React, { SetStateAction, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Cuisine } from "@/types";

type CuisineCheckboxProps = {
  cuisine: Cuisine;
  setRestaurantCuisines: React.Dispatch<SetStateAction<Cuisine[]>>;
  restaurantCuisines: Cuisine[];
};

const CuisineCheckbox = ({
  cuisine,
  setRestaurantCuisines,
  restaurantCuisines,
}: CuisineCheckboxProps) => {
  const [isCuisineChecked, setIsCuisineChecked] = useState<boolean>(false);

  const addAndRemoveCuisine = () => {
    if (isCuisineChecked === false) {
      setRestaurantCuisines((prev) => [...prev, cuisine]);
      setIsCuisineChecked(true);
    } else {
      const newRestaurantCuisines = restaurantCuisines.filter(
        (c) => c._id !== cuisine._id
      );
      setRestaurantCuisines(newRestaurantCuisines);
      setIsCuisineChecked(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox checked={isCuisineChecked} onClick={addAndRemoveCuisine} />
        <span>{cuisine.cuisineName}</span>
      </div>
    </>
  );
};

export default CuisineCheckbox;
