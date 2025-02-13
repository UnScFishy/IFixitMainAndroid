import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SignupScreen from './Signup';
import LoginScreen from './Login';
import ForgotPasswordScreen from './ForgotPassword';
import HomeScreen from './Home';
import ProfileScreen from './Profile';
import SettingsScreen from './Settings';
import AdminHomeScreen from './AdminHome';
import HistoryScreen from './History';
import ShopPinLocationScreen from './ShopPinLocation';
import YourLocationScreen from './YourLocation';
import ShopScreen from './Shop';
import PaymentScreen from './Payment';
import CustomerLocationScreen from './CustomerLocation';
import BookingScreen from './Booking';
import LoginPrivacy from './LoginPrivacy';
import SignupPrivacy from './SignupPrivacy';

interface PagesProps {
  setUserDetails: any; // Type for the setUserDetails function
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void,
  onNavigate: (screen: string) => void;
  currentScreen: string;
  user: any;
  userId: string;
  setViewProfile: (screen: string) => void;
  vehicle: number;
  setVehicle: (vehicle: number) => void;
  shop: string;
  setShop: (shop: string) => void;
  booking: string;
  setBooking: (booking: string) => void;
  shopLocation: { latitude: number, longitude: number };
  setShopLocation: (shopLocation: { latitude: number, longitude: number }) => void;
  yourLocation: { latitude: number, longitude: number };
  setYourLocation: (yourLocation: { latitude: number, longitude: number }) => void;
}

const Pages: React.FC<PagesProps> = ({ setUserDetails, setLoading, setAlert, onNavigate, currentScreen, user, setViewProfile, userId, vehicle, setVehicle, shop, setShop, booking, setBooking, shopLocation, setShopLocation, yourLocation, setYourLocation }) => {
  return (
    <ScrollView style={{ flex: 1}}>
      {currentScreen === 'signup' && <SignupScreen onNavigate={onNavigate} setUserDetails={setUserDetails} setLoading={setLoading} setAlert={setAlert} />}
      {currentScreen === 'login' && <LoginScreen onNavigate={onNavigate} setUserDetails={setUserDetails} setLoading={setLoading} setAlert={setAlert} />}
      {currentScreen === 'forgotpassword' && <ForgotPasswordScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} />}
      {currentScreen === 'home' && <HomeScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} vehicle={vehicle} setVehicle={setVehicle} />}
      {currentScreen === 'adminHome' && <AdminHomeScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user}/>}
      {currentScreen === 'profile' && <ProfileScreen onNavigate={onNavigate} setUserDetails={setUserDetails} setLoading={setLoading} setAlert={setAlert} user={user} shopLocation={shopLocation} setShopLocation={setShopLocation}/>}
      {currentScreen === 'settings' && <SettingsScreen onNavigate={onNavigate} setUserDetails={setUserDetails} setLoading={setLoading} setAlert={setAlert} user={user}/>}
      {currentScreen === 'history' && <HistoryScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user}/>}
      {currentScreen === 'shop-location' && <ShopPinLocationScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} shopLocation={shopLocation} setShopLocation={setShopLocation}/>}
      {currentScreen === 'your-location' && <YourLocationScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} setShop={setShop} vehicle={vehicle} setYourLocation={setYourLocation} />}
      {currentScreen === 'customer-location' && <CustomerLocationScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} setBooking={setBooking}/>}
      {currentScreen === 'shop' && <ShopScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} shop={shop} vehicle={vehicle} yourLocation={yourLocation} booking={booking} setBooking={setBooking}/>}
      {currentScreen === 'payment' && <PaymentScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} booking={booking} setBooking={setBooking}/>}
      {currentScreen === 'booking' && <BookingScreen onNavigate={onNavigate} setLoading={setLoading} setAlert={setAlert} user={user} booking={booking}/>}
      {currentScreen === 'login-privacy' && <LoginPrivacy onNavigate={onNavigate} />}
      {currentScreen === 'signup-privacy' && <SignupPrivacy onNavigate={onNavigate} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
});

export default Pages;
