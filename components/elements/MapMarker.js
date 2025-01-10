'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Preloader from './Preloader';
import variablesList from "@/components/common/Variable";

export default function MapMarker({
  isGeolocation,
  latitude,
  longitude,
  zoom,
  onPlaceSelected,
  address: initialAddress
}) {
  const [currentLocation, setCurrentLocation] = useState({ lat: latitude || 0, lng: longitude || 0 });
  const [zoomlevel, setZoomlevel] = useState(8);
  const [map, setMap] = useState(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState(initialAddress || "");
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCwhqQx0uqNX7VYhsgByiF9TzXwy81CFag', // Replace with your API key
    libraries: ['places'], // Required for Autocomplete
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
            setCurrentLocation({ lat: variablesList.defaultLatlong.lat, lng: variablesList.defaultLatlong.lng }); // Default location
          }
        );
      } else {
        setCurrentLocation({ lat: variablesList.defaultLatlong.lat, lng: variablesList.defaultLatlong.lng });
      }
    } else if (latitude && longitude) {
      setCurrentLocation({ lat: Number(latitude), lng: Number(longitude) });
    }
  }, [isGeolocation, latitude, longitude]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      setCurrentLocation({ lat: lat(), lng: lng() });
      setZoomlevel(14);

      const formattedAddress = place.formatted_address || 'No address found';
      setCurrentLocationAddress(formattedAddress);

      if (onPlaceSelected) {
        onPlaceSelected(formattedAddress, { lat: lat(), lng: lng() });
      }

      if (map && place.geometry) {
        map.panTo(place.geometry.location);
      }
    } else {
      alert('Place details are not available.');
    }
  };

  useEffect(() => {
    setCurrentLocationAddress(initialAddress || '');
  }, [initialAddress]);

  const geocodeLatLng = (lat, lng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      console.log("results>>>>>>>>>>>",results);
      if (status === 'OK' && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setCurrentLocationAddress(formattedAddress);

        if (onPlaceSelected) {
          onPlaceSelected(formattedAddress, { lat, lng });
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);

    // Create a new marker
    if (markerRef.current) {
      markerRef.current.setMap(null); // Remove the old marker if it exists
    }
    markerRef.current = new google.maps.Marker({
      position: currentLocation,
      map: mapInstance,
      draggable: false, // Make marker draggable
      title: 'Drag me!',
    });

    // Add dragend event listener
    // markerRef.current.addListener('dragend', (event) => {
    //   const newLat = event.latLng.lat();
    //   const newLng = event.latLng.lng();
    //   setCurrentLocation({ lat: newLat, lng: newLng });
    //   geocodeLatLng(newLat, newLng); // Update address based on new position
    // });
  }, [currentLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
    if (markerRef.current) {
      markerRef.current.setMap(null); // Clean up the marker
    }
  }, []);

  useEffect(() => {
    if (map && markerRef.current) {
      // Update marker position when currentLocation changes
      markerRef.current.setPosition(currentLocation);
    }
  }, [currentLocation, map]);

  // Handle manual address input change
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setCurrentLocationAddress(newAddress);

    if (onPlaceSelected) {
      onPlaceSelected(newAddress, currentLocation);
    }

    // Optionally, trigger geocode request to update the map based on new address
    // geocodeLatLng(currentLocation.lat, currentLocation.lng);  // Uncomment if needed
  };

  return (
    <>
      {isLoaded ? (
        <>
          <div>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              <fieldset className="fieldset-input">
                <input
                  type="text"
                  value={currentLocationAddress}
                  onChange={handleAddressChange} // Allow manual editing
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
          />
        </>
      ) : (
        <Preloader />
      )}
    </>
  );
}
