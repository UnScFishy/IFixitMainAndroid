import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Pages from './src/screens/Pages';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
Icon.loadFont();

function App(): React.JSX.Element {
  const [user, setUser] = useState({ role: 2});
  const [vehicle, setVehicle] = useState(1);
  const [shop, setShop] = useState('');
  const [booking, setBooking] = useState('');
  const [shopLocation, setShopLocation] = useState({ latitude: 0, longitude: 0});
  const [yourLocation, setYourLocation] = useState({ latitude: 0, longitude: 0});
  const [loading, setLoading]  = useState(false);
  const [alert, setAlert]  = useState({ show: false, title: '', message: '' });
  const [currentScreen, setCurrentScreen] = useState('login');
  const [profile, setProfile] = useState('');
  const [header, setHeader] = useState({ title: '', goBackPage: '', logout: false });

  const navigate = (screen: string) => {
    setCurrentScreen(screen);
    if(screen === 'home'){
      setHeader({ title: 'Home', goBackPage: '', logout: false});
    } else if(screen === 'history'){
      setHeader({ title: 'History', goBackPage: '', logout: false});
    } else if(screen === 'profile'){
      setHeader({ title: 'Profile', goBackPage: '', logout: true});
    } else if(screen === 'shop-location'){
      setHeader({ title: 'Pin Shop Location', goBackPage: 'profile', logout: false});
    } else if(screen === 'your-location'){
      setHeader({ title: 'Find Nearby Shops', goBackPage: 'home', logout: false});
    } else if(screen === 'shop'){
      setHeader({ title: 'Shop', goBackPage: 'your-location', logout: false});
    } else if(screen === 'payment'){
      setHeader({ title: 'Payment', goBackPage: 'shop', logout: false});
    } else if(screen === 'customer-location'){
      setHeader({ title: 'Customers', goBackPage: '', logout: false});
    } else if(screen === 'booking'){
      setHeader({ title: 'Booking', goBackPage: 'customer-location', logout: false});
    }
  };

  const setViewProfile = (userId: string) => {
    setProfile(userId);
    navigate('viewProfile');
  };

  const handleGoBack = (page: string) => {
    navigate(page);
  }

  const handleLogout = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';

    axios.post(apiUrl, {
      action: "logout",
      values: {}
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      navigate('login');
    }).catch(error => {
      if (error.response) {
        setAlert({ show: true, title: 'Error', message: error.response.data.error });
      } else {
        setAlert({ show: true, title: 'Error', message: 'Network Error' });
        console.log('Error:', error.message);
      }
    }).finally(()=>{
      setTimeout(()=>{
        setLoading(false);
      }, 1000);
    });
  };

  useEffect(()=>{
    console.log('USER_UPDATED', user);
  }, [user])

  useEffect(()=>{
    console.log('VEHICLE_UPDATED', vehicle);
  }, [vehicle])

  useEffect(()=>{
    console.log('SHOP_UPDATED', shop);
  }, [shop])

  useEffect(()=>{
    console.log('BOOKING_UPDATED', booking);
  }, [booking])

  useEffect(()=>{
    console.log('LOCATION_UPDATED', shopLocation);
  }, [shopLocation])

  useEffect(()=>{
    console.log('YOUR_LOCATION_UPDATED', yourLocation);
  }, [yourLocation])


  return (
    <View style={{ flex: 1 }}>
      { ['home', 'profile', 'settings', 'section', 'viewProfile', 'adminHome', 'history', 'shop-location', 'your-location', 'shop', 'payment', 'customer-location', 'booking'].includes(currentScreen) && 
        <View style={styles.topNavigation}>
          { header.goBackPage.length > 0 && 
            <TouchableOpacity onPress={()=>{handleGoBack(header.goBackPage);}} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          }
          { header.goBackPage.length === 0 &&
            <View style={styles.placeholder}></View>
          }
          
          <Text style={styles.title}>{header.title}</Text>

          { header.logout && 
            <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
              <Icon name="log-out" size={24} color="black" />
            </TouchableOpacity>
          }

          { !header.logout &&
            <View style={styles.placeholder}></View>
          }
        </View>
      }

      <View style={styles.pageContainer}>
        <Pages currentScreen={currentScreen} onNavigate={navigate} setUserDetails={setUser} setLoading={setLoading} setAlert={setAlert} user={user} setViewProfile={setViewProfile} userId={profile} vehicle={vehicle} setVehicle={setVehicle} shop={shop} setShop={setShop} booking={booking} setBooking={setBooking} shopLocation={shopLocation} setShopLocation={setShopLocation} yourLocation={yourLocation} setYourLocation={setYourLocation}></Pages>
      </View>

      { loading && 
        <View style={styles.backdrop}>
          <ActivityIndicator size="large" color="teal" />
        </View>
      }

      { alert.show && 
        <View style={styles.backdrop}></View>
      }

      { alert.show && 
        <View style={styles.centeredContainer}>
          <Text style={[styles.text, styles.textHeader]}> { alert.title } </Text>
          <Text style={styles.alertText}>{ alert.message }</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setAlert({ show: false, title: '', message: ''})}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      }

      { ['home', 'profile', 'settings', 'section', 'viewProfile', 'adminHome', 'history', 'shop-location', 'your-location', 'shop', 'payment', 'customer-location', 'booking'].includes(currentScreen) && 
        <View style={styles.bottomNavigation}>
          { user.role !== 2 &&
            <Icon name="home" size={24} color={currentScreen === 'home'? 'teal' : "#000"} onPress={()=>{ navigate('home')}}/>
          }
          { user.role === 2 &&
            <Icon name="map" size={24} color={currentScreen === 'customer-location'? 'teal' : "#000"} onPress={()=>{ navigate('customer-location')}}/>
          }
          { user.role !== 2 &&
            <Icon name="map" size={24} color={currentScreen === 'your-location'? 'teal' : "#000"} onPress={()=>{ navigate('your-location')}}/>
          }
          { user.role !== 2 &&
            <Icon name="tool" size={24} color={currentScreen === 'shop'? 'teal' : "#000"} onPress={()=>{ navigate('shop')}}/>
          }
          <Icon name="archive" size={24} color={currentScreen === 'history'? 'teal' : "#000"} onPress={()=>{ navigate('history')}}/>
          <Icon name="user" size={24} color={currentScreen === 'profile'? 'teal' : "#000"} onPress={()=>{ navigate('profile')}}/>
          
        </View>
      }
        
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,  // Take full height of the screen
    zIndex: 2, // Ensure it appears above the background
    marginLeft: 0,
    width: '100%', // Set the width to 80% of the screen
    maxHeight: '100%', // Set maximum height to 90% of the screen
    backgroundColor: 'white'
  },
  backgroundContainer: {
    flex: 1,  // Take full height of the screen
    flexDirection: 'column', // Layout children vertically
    backgroundColor: 'teal',
    position: 'absolute',  // Make the background container absolute
    top: 0,  // Start at the top of the screen
    left: 0, // Start at the left of the screen
    right: 0, // Stretch to the right of the screen
    bottom: 0, // Stretch to the bottom of the screen
    zIndex: -1, // Ensure it's behind the other content
  },
  top: {
    height: '36%',  // Green top section (height doesn't change)
    backgroundColor: 'teal',
    borderBottomLeftRadius: 70,  // Rounded corners at bottom-left
    borderBottomRightRadius: 70, // Rounded corners at bottom-right
  },
  middle: {
    height: 120,
    backgroundColor: 'white',
    borderTopLeftRadius: '40%',  // Increase horizontal radius for wider top-left curve
    borderTopRightRadius: '40%', // Increase horizontal radius for wider top-right curve
  },
  bottom: {
    flex: 1,
    backgroundColor: 'white',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centeredContainer: {
    position: 'absolute',
    marginTop: 150,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'black',
    padding: 20,
    overflow: 'hidden',
    flexDirection: 'column', 
    alignItems: 'flex-start',
    zIndex: 20,
    marginLeft: '15%',
    marginRight: '15%',
    width: '70%'
  },
  textHeader: {
    textAlign: 'center',
    width: '100%',
    padding: 1,
    paddingBottom: 3,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#4F7C82'
  },
  text: {
    fontFamily: 'BalsamiqSans-Regular',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'BalsamiqSans-Regular',
  },
  secondaryButton: {
    backgroundColor: '#4F7C82', 
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  alertText: {
    justifyContent: 'center',
    alignContent:'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    padding: 10
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopColor: 'black',
    borderTopWidth: 3,
    padding: 10,
    zIndex: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 40,
  },
  topNavigation: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    zIndex: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 50, // Placeholder to balance the back button
  },
  logoutButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
