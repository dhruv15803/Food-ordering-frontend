import React, { SetStateAction, useState } from 'react'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { City } from '@/types';
import axios from 'axios';
import { backendUrl } from '@/App';

type AdminCityCardProps = {
    cityName:string;
    id:string;
    deleteCity:(id:string) => Promise<void>;
    cities:City[];
    setCities:React.Dispatch<SetStateAction<City[]>>;
}

const AdminCityCard = ({cityName,id,deleteCity,cities,setCities}:AdminCityCardProps) => {
    const [isCityEdit,setIsCityEdit] = useState<boolean>(false);
    const [newCityName,setNewCityName] = useState<string>("");
    const [editErrorMsg,setEditErrorMsg] = useState<string>("");

    const toggleEdit = () => {
        if(isCityEdit===false) {
            setIsCityEdit(true);
            setNewCityName(cityName);
        } else {
            setIsCityEdit(false);
            setNewCityName("");
            setEditErrorMsg("");
        }
    }

    const editCity = async () => {
        if(newCityName.trim()==="") {
            setEditErrorMsg("Please enter a city");
            setTimeout(() => {
                setEditErrorMsg("");
            },4000)
            return;
        }
        if(newCityName.trim().toLowerCase()===cityName) {
            setIsCityEdit(false);
            setNewCityName("");
            return;
        }
        const response = await axios.put(`${backendUrl}/api/admin/editCity`,{
             newCityName,
             id,
        })
        const newCities = cities.map((city) => {
            if(city._id===id) {
                return response.data.newCity;
            } else {
                return city;
            }
        })
        setCities(newCities);
        setIsCityEdit(false);
        setNewCityName("");
    }

  return (
    <>
    <div className='flex flex-col border-2 rounded-lg p-4 my-2'>
    <div className='flex items-center'>
        <div className='w-[50%] mx-2 font-semibold'>
            {isCityEdit ? <>
            <Input value={newCityName} onChange={(e) => setNewCityName(e.target.value)} type='text' name='newCityName'/>
            </> : cityName}
        </div>
        <div className='flex items-center gap-2'>
            {isCityEdit===false && <Button variant="destructive" onClick={() => deleteCity(id)}>Delete</Button>}
            <Button onClick={toggleEdit} variant="secondary">{isCityEdit ? 'Cancel' : 'Edit'}</Button>
            {isCityEdit && <Button onClick={editCity}>Edit</Button>}
        </div>
    </div>
    <div className='text-red-500'>{editErrorMsg}</div>
    </div>
    </>
  )
}

export default AdminCityCard;