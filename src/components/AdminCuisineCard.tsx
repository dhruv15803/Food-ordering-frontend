import React, { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Cuisine } from "@/types";
import axios from "axios";
import { backendUrl } from "@/App";

type AdminCuisineCardProps = {
  cuisineName: string;
  id: string;
  deleteCuisine: (id: string) => Promise<void>;
  cuisines: Cuisine[];
  setCuisines: React.Dispatch<SetStateAction<Cuisine[]>>;
};

const AdminCuisineCard = ({
  cuisineName,
  id,
  deleteCuisine,
  cuisines,
  setCuisines,
}: AdminCuisineCardProps) => {
  const [isEditCuisine, setIsEditCuisine] = useState<boolean>(false);
  const [newCuisineName, setNewCuisineName] = useState<string>("");
  const [editErrorMsg, setEditErrorMsg] = useState<string>("");

  const toggleEdit = () => {
    if (isEditCuisine === false) {
      setIsEditCuisine(true);
      setNewCuisineName(cuisineName);
    } else {
      setIsEditCuisine(false);
      setNewCuisineName("");
      setEditErrorMsg("");
    }
  };

  const editCuisine = async () => {
    try {
        if (newCuisineName.trim() === "") {
            setEditErrorMsg("Please enter a cuisine");
            setTimeout(() => {
              setEditErrorMsg("");
            }, 4000);
            return;
          }
          // check if newCuisine is same as current cuisine
          if (newCuisineName.trim().toLowerCase() === cuisineName) {
            setIsEditCuisine(false);
            setNewCuisineName("");
            return;
          }
      
          // api call to edit cuisine
          const response = await axios.put(`${backendUrl}/api/admin/editCuisine`,{
              newCuisineName,
              id,
          });
          console.log(response);
          // if here then all good -> edit cuisines
          const newCuisines = cuisines.map((cuisine) => {
            if (cuisine._id === id) {
              return response.data.newCuisine;
            } else {
              return cuisine;
            }
          });
          setCuisines(newCuisines);
          setIsEditCuisine(false);
          setNewCuisineName("");
    } catch (error:any) {
        console.log(error);
        setEditErrorMsg(error.response.data.message);
        setTimeout(() => {
            setEditErrorMsg("");
        },4000);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-2 my-2 border-2 rounded-lg">
        <div className="flex items-center">
          <div className="font-semibold w-[50%]">
            {" "}
            {isEditCuisine ? (
              <>
                <Input
                  value={newCuisineName}
                  onChange={(e) => setNewCuisineName(e.target.value)}
                  type="text"
                />
              </>
            ) : (
              cuisineName.charAt(0).toUpperCase() + cuisineName.slice(1)
            )}
          </div>
          <div className="flex items-center gap-2 mx-4">
            {!isEditCuisine && (
              <Button onClick={() => deleteCuisine(id)} variant="destructive">
                Delete
              </Button>
            )}
            <Button onClick={toggleEdit} variant="secondary">
              {isEditCuisine ? "Cancel" : "Edit"}
            </Button>
            {isEditCuisine && <Button onClick={editCuisine}>Edit</Button>}
          </div>
        </div>
        <div className="text-red-500">{editErrorMsg}</div>
      </div>
    </>
  );
};

export default AdminCuisineCard;
