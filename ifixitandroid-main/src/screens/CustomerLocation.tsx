import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';

type CustomerLocationScreenProps = {
  onNavigate: (screen: 'login' | 'home' | 'modules' | 'profile' | 'shop' | 'booking') => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: { show: boolean; title: string; message: string }) => void;
  user: any;
  setBooking: (booking: string) => void;
};

const CustomerLocationScreen: React.FC<CustomerLocationScreenProps> = ({ setLoading, setBooking, onNavigate }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<any[]>([]);

  const getCurrentLocation = () => {
    setLoading(true);
    
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'get-shop-location-by-owner',
      values: {}
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(!response.data.error){
        setRegion({
          latitude: response.data.data.latitude,
          longitude: response.data.data.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLocation({ latitude: response.data.data.latitude, longitude: response.data.data.longitude });


        axios.post(apiUrl, {
          action: 'get-active-bookings-by-owner',
          values: {}
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => {
          if(!response.data.error){
            setNearbyMarkers(response.data.active_bookings);

            setTimeout(()=>{
              setLoading(false);
            }, 1000);
          }
        }).catch(error => {
          console.log(error);
        });

      }
    }).catch(error => {
      console.log(error);
    });
  };

  const handleMarkerPress = (marker: any) => {
    setBooking(marker.booking_id);
    onNavigate('booking');
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

  useEffect(()=>{
    getCurrentLocation();
  }, []);

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
          {nearbyMarkers?.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              pinColor={'blue'}
              onPress={() => handleMarkerPress(marker)}
            />
          )) || null}
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

export default CustomerLocationScreen;
