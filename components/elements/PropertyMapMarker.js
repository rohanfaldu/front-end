'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import Preloader from './Preloader';

export default function PropertyMapMarker({ isGeolocation, latitude, longitude, zoom, onPlaceSelected, address }) {
  const [currentLocation, setCurrentLocation] = useState({ lat: latitude || 0, lng: longitude || 0 });
  const [zoomlevel, setZoomlevel] = useState(8);
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCwhqQx0uqNX7VYhsgByiF9TzXwy81CFag',
    libraries: ['places'],
  });



  useEffect(() => {
    setZoomlevel(zoom);
    if (isGeolocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            setCurrentLocation({ lat: 33.985047, lng: -118.469483 });
          }
        );
      } else {
        setCurrentLocation({ lat: 33.985047, lng: -118.469483 });
      }
    } else if (latitude && longitude) {
      setCurrentLocation({ lat: Number(latitude), lng: Number(longitude) });
    }
  }, [isGeolocation, latitude, longitude]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    console.log('Selected place:', place);

    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setCurrentLocation({ lat: lat(), lng: lng() });
      setZoomlevel(14);

      const formattedAddress = place.formatted_address || 'No address found';
      const addressComponents = place.address_components;
      const addressName = place.name;

      let fullAddress = formattedAddress;
      if (addressComponents) {
        fullAddress = addressComponents.map((component) => component.long_name).join(', ');
      }

      console.log('Full Address:', `${addressName},${fullAddress}`);

      if (onPlaceSelected) {

        onPlaceSelected(fullAddress, { lat: lat(), lng: lng() });
      }

      if (map && place.geometry) {
        map.panTo(place.geometry.location);
      }
    } else {
      alert("Place details are not available.");
    }
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <>
      {isLoaded ? (
        <>

          <div >
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              <fieldset className="fieldset-input">
                <input
                  type="text"
                  value={address}
                  label="Search for a place"
                  className="ip-file map-search-input"
                  placeholder="Search for a place"

                />
              </fieldset>

            </Autocomplete>
          </div>


          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={zoomlevel}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >

          </GoogleMap>
        </>
      ) : (
        <Preloader />
      )}
    </>
  );
}
