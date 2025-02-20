'use client'
import { insertData } from "../../components/api/Axios/Helper";
export const fetchData = async (url, data = {}, auth = true) => {
    try {
        const response = await insertData(url, data, auth);
        if (response && response.status) {
            return response.data;
        } else {
            console.error(`Failed to fetch data from ${url}:`, response);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
};


export const updateMapCoords = (location, setCoords, zoom) => {
    if (location) {
        const { latitude, longitude } = location;
        setCoords({ latitude, longitude, zoom });
    } else {
        console.error('Invalid location data:', location);
    }
};

export const handleDropdownChange = async (
    type,
    id,
    sourceList,
    setList,
    apiUrl,
    additionalParams = {},
    setCoords = null,
    zoom = null
) => {
    const selectedItem = sourceList.find((item) => item.id === id);
    if (selectedItem && setCoords && zoom) {
        updateMapCoords(selectedItem, setCoords, zoom);
    }

    if (!id) {
        setList([]); // Clear the list if no ID is selected
        return;
    }

    try {
        const params = { ...additionalParams, id };
        const data = await fetchData( apiUrl, params);
        const response = type === 'city' ? data.cities : data;
        setList(response || []);
    } catch (error) {
        console.error(`Error handling dropdown change for ID ${id}:`, error);
        setList([]);
    }
};
