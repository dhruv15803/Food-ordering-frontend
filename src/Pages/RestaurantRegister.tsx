import { GlobalContext, backendUrl } from "@/App";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalContextType } from "@/types";
import axios from "axios";
import  { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantCity, setRestaurantCity] = useState<string>("");
  const { cities } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [citiesSuggestions, setCitiesSuggestions] = useState<string[]>([]);
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [restaurantThumbnailFile, setRestaurantThumbnailFile] =
    useState<File | null>(null);
  const [restaurantThumbnailUrl, setRestaurantThumbnailUrl] =
    useState<string>("");
  const [isThumbnailLoading, setIsThumbnailLoading] = useState<boolean>(false);
  const [registerRestaurantError, setRegisterRestaurantError] =
    useState<string>("");

  const registerRestaurant = async () => {
    try {
      if (
        restaurantName.trim() === "" ||
        restaurantCity.trim() === "" ||
        addressLine1.trim() === "" ||
        addressLine2.trim() === ""
      ) {
        setRegisterRestaurantError("Please enter all fields");
        setTimeout(() => {
          setRegisterRestaurantError("");
        }, 4000);
        return;
      }
      // make sure the city is a valid city
      let isCity = false;
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].cityName === restaurantCity.trim().toLowerCase()) {
          isCity = true;
          break;
        }
      }
      if (!isCity) {
        setRegisterRestaurantError("City not supported");
        setTimeout(() => {
          setRegisterRestaurantError("");
        }, 4000);
      }
      const response = await axios.post(
        `${backendUrl}/api/restaurant/register`,
        {
          restaurantThumbnailUrl,
          restaurantName,
          restaurantCity,
          addressLine1,
          addressLine2,
        },
        { withCredentials: true }
      );
      console.log(response);
      navigate(`/restaurant/menu/${response.data.newRestaurant._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const filterCitySearch = () => {
      if (restaurantCity.length < 2) {
        setCitiesSuggestions([]);
        return;
      }
      let temp = [];
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].cityName === restaurantCity.trim().toLowerCase()) {
          setCitiesSuggestions([]);
          return;
        }
        if (cities[i].cityName.includes(restaurantCity)) {
          temp.push(cities[i].cityName);
        }
      }
      setCitiesSuggestions(temp);
    };
    filterCitySearch();
  }, [restaurantCity]);

  useEffect(() => {
    const getFileUrl = async () => {
      try {
        if (
          restaurantThumbnailFile === null ||
          restaurantThumbnailFile === undefined
        ) {
          return;
        }
        setIsThumbnailLoading(true);
        const response = await axios.post(
          `${backendUrl}/api/restaurant/upload`,
          {
            restaurantThumbnailFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRestaurantThumbnailUrl(response.data.url);
      } catch (error) {
        console.log(error);
      } finally {
        setIsThumbnailLoading(false);
      }
    };
    getFileUrl();
  }, [restaurantThumbnailFile]);
  return (
    <>
      <div className="flex items-center w-[80%] mx-auto mt-16 text-2xl font-semibold">
        Register Restaurant
      </div>
      <div className="flex flex-col p-2 w-[80%] mx-auto my-4 gap-4">
        <div className="flex  gap-2">
          <label
            className="text-sm font-semibold w-fit border flex items-center px-4 py-2 rounded-lg hover:bg-blue-100 hover:duration-300"
            htmlFor="restaurantThumbnailFile"
          >
            {restaurantThumbnailUrl !== ""
              ? "Change thumbnail"
              : "Upload thumbnail"}
          </label>
          {restaurantThumbnailUrl !== "" && (
            <Button
              variant="outline"
              onClick={() => {
                setRestaurantThumbnailUrl("");
                setRestaurantThumbnailFile(null);
              }}
            >
              Remove thumbnail
            </Button>
          )}
          <input
            hidden
            onChange={(e) => setRestaurantThumbnailFile(e.target.files![0])}
            type="file"
            name="restaurantThumbnailFile"
            id="restaurantThumbnailFile"
          />
        </div>
        <div>
          {isThumbnailLoading ? (
            <>
              <Loader height="50" width="50" />
            </>
          ) : (
            <img
              className="w-40 aspect-auto"
              src={restaurantThumbnailUrl}
              alt=""
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xl" htmlFor="restaurantName">
            Enter restaurant name
          </Label>
          <Input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            type="text"
            name="restaurantName"
            placeholder="Restaurant name"
            id="restaurantName"
          />
        </div>
        <div className="flex flex-col">
          <Label className="text-xl mb-2" htmlFor="restaurantCity">
            Enter restaurant city
          </Label>
          <Input
            value={restaurantCity}
            onChange={(e) => setRestaurantCity(e.target.value)}
            type="text"
            name="restaurantCity"
            placeholder="Restaurant city"
            id="restaurantCity"
          />
          {citiesSuggestions.length !== 0 && (
            <div className="flex flex-col border-t-0 gap-2 border-l border-b border-r p-2 rounded-b-lg">
              {citiesSuggestions?.map((city, i) => {
                return (
                  <div
                    onClick={() => {
                      setRestaurantCity(city);
                    }}
                    className="cursor-pointer hover:bg-blue-100 p-2 rounded-lg"
                    key={i}
                  >
                    {city}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xl" htmlFor="addressLine1">
            Enter address line 1
          </Label>
          <Input
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            type="text"
            name="addressLine1"
            placeholder="Address line 1"
            id="addressLine1"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xl" htmlFor="addressLine2">
            Enter address line 2
          </Label>
          <Input
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            type="text"
            name="addressLine2"
            placeholder="nearby landmarks"
            id="addressLine2"
          />
        </div>
        <div className="text-red-500">{registerRestaurantError}</div>
        <Button onClick={registerRestaurant}>Next</Button>
      </div>
    </>
  );
};

export default RestaurantRegister;
