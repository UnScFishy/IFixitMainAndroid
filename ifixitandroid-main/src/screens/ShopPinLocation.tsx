import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type ShopPinLocationScreenProps = {
  onNavigate: (screen: 'login' | 'home' | 'modules' | 'profile') => void;
  setLoading: (loading: boolean) => void;
  setAlert: (alert: { show: boolean; title: string; message: string }) => void;
  user: any;
  shopLocation: { latitude: number, longitude: number };
  setShopLocation: (shopLocation: { latitude: number, longitude: number }) => void;
};

const ShopPinLocationScreen: React.FC<ShopPinLocationScreenProps> = ({ onNavigate, setLoading, setAlert, user, shopLocation, setShopLocation }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setLoading(false);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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

  const handleSaveLocation = () => {
    if (location) {
      setAlert({
        show: true,
        title: 'Location Saved',
        message: `Your shop location has been pinned at (${location.latitude}, ${location.longitude}).`,
      });
      setShopLocation(location);
      onNavigate('profile');
    } else {
      Alert.alert('Error', 'Please select a valid location before saving.');
    }
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
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          onPress={e =>
            setLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            draggable
            onDragEnd={e =>
              setLocation({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
          />
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Fetching your current location...</Text>
      )}

      {location && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
          <Text style={styles.saveButtonText}>Save Pin Location</Text>
        </TouchableOpacity>
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
    height: 800
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

export default ShopPinLocationScreen;
