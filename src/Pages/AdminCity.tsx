import { backendUrl } from "@/App";
import AdminCityCard from "@/components/AdminCityCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { City } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminCity = () => {
  const [cityName, setCityName] = useState<string>("");
  const [cityErrorMsg, setCityErrorMsg] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const citiesPerPage = 5;

  const indexOfLastCity = citiesPerPage * currentPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);
  const noOfPages = Math.ceil(cities.length / citiesPerPage);

  const addCity = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (cityName.trim() === "") {
        setCityErrorMsg("Please enter a city");
        setTimeout(() => {
          setCityErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(`${backendUrl}/api/admin/addCity`, {
        cityName,
      });
      setCities((prev) => [...prev, response.data.city]);
      setCityName("");
    } catch (error: any) {
      console.log(error);
      setCityErrorMsg(error.response.data.message);
      setTimeout(() => {
        setCityErrorMsg("");
      }, 4000);
    }
  };

  const deleteCity = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteCity/${id}`
      );
      console.log(response);
      const newCities = cities.filter((city) => city._id !== id);
      setCities(newCities);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/getAllCities`
        );
        setCities(response.data.cities);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (currentCities.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentCities]);

  return (
    <>
      <div className="flex flex-col w-[80%] mx-auto border-2 p-4">
        <div className="text-xl my-4">Manage cities</div>
        <form onSubmit={(e) => addCity(e)} className="flex items-center gap-2">
          <Input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            type="text"
            name="cityName"
            placeholder="eg:Mumbai"
          />
          <Button>Add city</Button>
        </form>
        <div className="text-red-500">{cityErrorMsg}</div>
        {currentCities?.map((city) => {
          return (
            <AdminCityCard
              key={city._id}
              cityName={city.cityName}
              id={city._id}
              deleteCity={deleteCity}
              cities={cities}
              setCities={setCities}
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

export default AdminCity;
