import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';

type YourLocationScreenProps = {
  onNavigate: (screen: 'login' | 'home' | 'modules' | 'profile' | 'shop') => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: { show: boolean; title: string; message: string }) => void;
  user: any;
  setShop: (shop: string) => void;
  vehicle: number;
  setYourLocation: (yourLocation: { latitude: number, longitude: number }) => void;
};

const YourLocationScreen: React.FC<YourLocationScreenProps> = ({ setLoading, setShop, onNavigate, vehicle, setYourLocation }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     const permission =
  //       Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  //     const result = await check(permission);
  //     if (result === RESULTS.GRANTED) {
  //       getCurrentLocation();
  //     } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
  //       const requestResult = await request(permission);
  //       if (requestResult === RESULTS.GRANTED) {
  //         getCurrentLocation();
  //       } else {
  //         setErrorMessage('Location permission is needed to pin your shop location.');
  //       }
  //     } else {
  //       setErrorMessage('Location permission is needed to pin your shop location.');
  //     }
  //   };

  //   requestLocationPermission();
  // }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position: any) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setYourLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        
        const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
        axios.post(apiUrl, {
          action: 'service-fetch-by-category',
          values: {
            category: vehicle,
            latitude: latitude,
            longitude: longitude
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if(response.data && !response.data.error){
            setMarkers(response.data);
          }
        }).catch(error => {
          console.log(error);
        }).finally(()=>{
          setTimeout(()=>{
            setLoading(false);
          }, 1000);
        });


      },
      (error: any) => {
        console.error("Geolocation Error:", error.toString());
        setLoading(false);
        setErrorMessage(error);
      },
      { enableHighAccuracy: false, timeout: 95000, maximumAge: 60000 }
    );
  };

  useEffect(()=>{
    getCurrentLocation();
  }, []);

  const handleMarkerPress = (marker: any) => {
    setShop(marker.id);
    onNavigate('shop');
  };

  const restrictRegion = (newRegion: Region) => {
    if (!location) return newRegion;

    const distance = Math.sqrt(
      Math.pow(newRegion.latitude - location.latitude, 2) +
      Math.pow(newRegion.longitude - location.longitude, 2)
    );

    const maxDistance = 20 / 111; // 20km radius in degrees (approx.)
    if (distance > maxDistance) {
      return region;
    }
    return newRegion;
  };

  const nearbyMarkers = [
    { latitude: location?.latitude! + 0.02, longitude: location?.longitude! + 0.02, color: 'blue', shopId: '1', name: 'Green Marker' },
    { latitude: location?.latitude! - 0.015, longitude: location?.longitude! - 0.015, color: 'blue', shopId: '2', name: 'Blue Marker' },
    { latitude: location?.latitude! + 0.01, longitude: location?.longitude! - 0.01, color: 'blue', shopId: '3', name: 'Red Marker' },
  ];

  return (
    <View style={styles.mainContainer}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : location ? (
        <MapView
          style={styles.map}
          initialRegion={region!}
          region={region!}
          onRegionChangeComplete={(newRegion) => setRegion(restrictRegion(newRegion))}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
          />
          {location && markers?.length ? markers.map((marker: any, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              pinColor="blue"
              onPress={() => handleMarkerPress(marker)}
            />
          )) : null}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Fetching your current location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    height: 300
  },
  map: {
    width: '100%', 
    height: 1200
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  saveButton: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default YourLocationScreen;
