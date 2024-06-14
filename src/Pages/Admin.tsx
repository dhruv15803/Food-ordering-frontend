import { GlobalContext, backendUrl } from "@/App";
import AdminCuisineCard from "@/components/AdminCuisineCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cuisine, GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const Admin = () => {
  const [cuisineName, setCuisineName] = useState<string>("");
  const [cuisineErrorMsg, setCuisineErrorMsg] = useState<string>("");
  const {cuisines,setCuisines} = useContext(GlobalContext) as GlobalContextType;
  const cuisinePerPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const indexOfLastCuisine = cuisinePerPage * currentPage;
  const indexOfFirstCuisine = indexOfLastCuisine - cuisinePerPage;
  const currentCuisines = cuisines.slice(
    indexOfFirstCuisine,
    indexOfLastCuisine
  );
  const noOfPages = Math.ceil(cuisines.length / cuisinePerPage);

  const addCuisine = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (cuisineName.trim() === "") {
        setCuisineErrorMsg("Please enter a cuisine");
        setTimeout(() => {
          setCuisineErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/admin/addCuisine`,
        {
          cuisineName,
        },
        { withCredentials: true }
      );
      console.log(response);
      setCuisines((prev) => [...prev, response.data.newCuisine]);
      setCuisineName("");
    } catch (error: any) {
      console.log(error);
      setCuisineErrorMsg(error.response.data.message);
      setTimeout(() => {
        setCuisineErrorMsg("");
      }, 4000);
    }
  };

  const deleteCuisine = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteCuisine/${id}`
      );
      console.log(response);
      const newCuisines = cuisines.filter((cuisine) => cuisine._id !== id);
      setCuisines(newCuisines);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentCuisines.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentCuisines]);

  return (
    <>
      <div className="flex flex-col p-4 w-[80%] mx-auto border-2">
        <div className="flex items-center text-xl mb-4">Manage cuisines</div>
        <form
          onSubmit={(e) => addCuisine(e)}
          className="flex items-center gap-4 my-4"
        >
          <Input
            value={cuisineName}
            onChange={(e) => setCuisineName(e.target.value)}
            type="text"
            name="cuisineName"
            placeholder="eg: Indian"
          />
          <Button>Add cuisine</Button>
        </form>
        {cuisineErrorMsg !== "" && (
          <div className="text-red-500 my-2">{cuisineErrorMsg}</div>
        )}
        {currentCuisines?.map((cuisine) => {
          return (
            <AdminCuisineCard
              key={cuisine._id}
              cuisineName={cuisine.cuisineName}
              id={cuisine._id}
              deleteCuisine={deleteCuisine}
              cuisines={cuisines}
              setCuisines={setCuisines}
            />
          );
        })}
        {noOfPages > 1 && (
          <Pagination
            noOfPages={noOfPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default Admin;
