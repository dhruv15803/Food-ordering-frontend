import React, { useContext, useEffect, useState } from "react";
import heroImg from "../assets/hero.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import landingImage from "../assets/landing.png";
import appDownloadImage from "../assets/appDownload.png";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "@/App";
import { City, GlobalContextType } from "@/types";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

const Home = () => {
  const [searchCity, setSearchCity] = useState<string>("");
  const { cities, setCities } = useContext(GlobalContext) as GlobalContextType;
  const [citiesSuggestions, setCitiesSuggestions] = useState<string[]>([]);
  const [cityErrorMsg, setCityErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isCity = false;
    for (let i = 0; i < cities.length; i++) {
      if (searchCity.trim().toLowerCase() === cities[i].cityName) {
        isCity = true;
        break;
      }
    }
    if (!isCity) {
      setCityErrorMsg("Please enter a valid city");
      setTimeout(() => {
        setCityErrorMsg("");
      }, 4000);
      return;
    }
    navigate(`/restaurant/results/${searchCity}`);
  };

  useEffect(() => {
    const filterCitySearch = () => {
      if (searchCity.length < 2) {
        setCitiesSuggestions([]);
        return;
      }
      let temp = [];
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].cityName === searchCity.trim().toLowerCase()) {
          setCitiesSuggestions([]);
          return;
        }
        if (cities[i].cityName.includes(searchCity)) {
          temp.push(cities[i].cityName);
        }
      }
      setCitiesSuggestions(temp);
    };
    filterCitySearch();
  }, [searchCity]);

  return (
    <>
      <div className="flex flex-col border-2">
        <div>
          <img
            src={heroImg}
            className="w-full max-h-[600px] object-cover"
            alt=""
          />
        </div>
        <div className="flex flex-col p-8">
          <div className="bg-white rounded-lg flex flex-col gap-5 text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-orange-600">
              Tuck into a takeway today
            </h1>
            <span className="text-xl">Food is just a click away!</span>
            <form
              onSubmit={(e) => handleSearchSubmit(e)}
              className="flex items-center gap-2 w-[80%] mx-auto"
            >
              <Input
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                type="text"
                name="searchCity"
                id="searchCity"
                placeholder="Search by city"
              />
              <Button variant="outline">Search</Button>
            </form>
          </div>
          {citiesSuggestions.length !== 0 && (
            <div className="flex flex-col gap-2 border-b border-l border-r w-[80%] mx-auto">
              {citiesSuggestions?.map((city, i) => {
                return (
                  <span
                    className="p-2 hover:bg-blue-200 hover:duration-300"
                    onClick={() => setSearchCity(city)}
                    key={i}
                  >
                    {city}
                  </span>
                );
              })}
            </div>
          )}
          <div className="text-red-500">{cityErrorMsg}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <img src={landingImage} />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">
              Order takeaway even faster!
            </span>
            <span>
              Download the MernEats App for faster ordering and personalised
              recommendations
            </span>
            <img src={appDownloadImage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
