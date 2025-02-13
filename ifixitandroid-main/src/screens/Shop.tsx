// ShopScreen.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';

type ShopScreenProps = {
  onNavigate: (screen: 'login' | 'home' | 'modules' | 'payment') => void;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any;
  shop: string;
  vehicle: number;
  yourLocation: { latitude: number, longitude: number };
  booking: string;
  setBooking: (booking: string) => void;
};

const ShopScreen: React.FC<ShopScreenProps> = ({ onNavigate, setLoading, setAlert, user, shop, vehicle, yourLocation, booking, setBooking }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [bookings, setBookings] = useState<any>([]);
  const [messenger, setMessenger] = useState<string>(''); 
  const [issue, setIssue] = useState<string>('');

  const handleDateSelect = (day: any) => {
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison
    const selected = new Date(day.dateString); // Convert the selected date to a Date object
  
    // Check if the selected date is today or in the future
    if (selected >= today) {
      setSelectedDate(day.dateString);
      setAlert({ show: true, title: 'Info', message: `You selected: ${day.dateString}` });
    } else {
      setAlert({ show: true, title: 'Error', message: 'Please select a current or future date.' });
    }
  };

  const getShop = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: "service-get-shop-by-id",
      values: {
        "shop_id": shop
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setName(response.data.shop_name);
      setId(response.data.shop_id);
      setMessenger(response.data.messenger);
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

  const getBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: "get-active-bookings",
      values: {}
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log("BOOKINGS:" , response.data.qrcode);
      setBookings(response.data.bookings);
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
    getShop();
  }, []);

  useEffect(()=>{
    getBooking();
  }, []);

  const handleBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'service-book-service',
      values: {
        shop_id: shop,
        category: vehicle,
        date: selectedDate,
        latitude: yourLocation.latitude,
        longitude: yourLocation.longitude,
        issue: issue
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(response.data.success){
        setAlert({ show: true, title: 'Success', message: response.data.message });
        getBooking();
      } else {
        setAlert({ show: true, title: 'Error', message: response.data.error });
      }
    }).catch(error => {
      if (error.response) {
        setAlert({ show: true, title: 'Error', message: error.response.data.error });
      } else {
        setAlert({ show: true, title: 'Error', message: 'Network Error' });
        console.log('Error:', error);
      }
    }).finally(()=>{
      setTimeout(()=>{
        setLoading(false);
      }, 1000);
    });
  };

  const vehicleTypeMapping: { [key: number]: string } = {
    1: "Bicycle",
    2: "Motorcycle",
    3: "Tricycle",
    4: "Car"
  };

  const statusMapping: { [key: number]: string } = {
    1: "Pending",
    2: "Accepted",
    3: "Declined",
    4: "Processing Payment",
    5: "Completed"
  };

  const openMessenger = () => {
    const messengerLink = messenger; // Replace with the actual Messenger username
    Linking.openURL(messengerLink)
      .catch((err) => console.error('Error opening Messenger:', err));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.listContainer}>

        { shop != "" &&
          <>
            <View style={styles.listItem}>
              <Text>Shop Name: { name }</Text>
              <Text>MechanicId: { id }</Text>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: 'teal' },
              }}
              style={styles.calendar}
            />

            <TextInput
              style={styles.textInputIcon}
              placeholder="Vehicle Issue"
              placeholderTextColor="#888"
              value={issue}
              onChangeText={(text) => { setIssue(text)}}
            />
            
            <TouchableOpacity style={styles.formButton} onPress={handleBooking}>
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </>
        }

        <Text style={styles.textHeader}> Active Bookings </Text>
        {bookings && bookings.map((booking: any, index: any) => (
            <View key={index} style={styles.listItem}>
              <Text>Shop Name: { booking.shop_name }</Text>
              <Text>MechanicId: { booking.shop_id } </Text>
              <Text>Schedule: { booking.date }</Text>
              <Text>Vehicle Type: { vehicleTypeMapping[booking.category] || "Unknown" }</Text>
              <Text>Status: { statusMapping[booking.status] || "Unknown" }</Text>
              <Text>Issue: {booking.issue}</Text>
              <View style={{ flex: 1, flexDirection: 'row'}}>
                {
                  booking.status === 2 && <>
                  <TouchableOpacity style={styles.button} onPress={openMessenger}>
                    <Text style={styles.buttonText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={()=>{
                    setBooking(booking.booking_id);
                    onNavigate('payment');
                  }}>
                    <Text style={styles.buttonText}>Payment</Text>
                  </TouchableOpacity>
                  </>
                }
              </View>
            </View>
          ))
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      alignContent: 'center',
      marginTop: 48,
      marginBottom: 48,
    },
    listContainer: {
      flex: 1,
      position: 'relative',
      backgroundColor: 'white',
      width: '100%',
      overflow: 'hidden',
      padding: 10,
    },
    listItem: {
      borderBottomWidth: 2,
      borderBottomColor: 'gray',
      marginBottom: 10,
      paddingBottom: 10
    },
    textInputIcon: {
      backgroundColor: "#ffffff",
      color: "#000",
      width: '100%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'gray',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 12,
      marginBottom: 10
    },
    box: {
      width: '40%',
      height: '40%',
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    centeredContainer: {
        marginTop: 75,
        marginBottom: 70,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'black',
        padding: 20,
        overflow: 'hidden',
        flexDirection: 'column', 
        alignItems: 'flex-start'
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
      borderBottomColor: '#4F7C82',
      marginTop: 30
    },
    textLabel: {
      marginTop: 10,
      fontWeight: 'bold'
    },
    textQuestion: {
      marginBottom: 10
    },
    text: {
      fontFamily: 'BalsamiqSans-Regular',
    },
    textAnswer: {
      width: '100%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      paddingLeft: 20,
      fontSize: 12,
      fontFamily: 'BalsamiqSans-Italic',
    },
    button: {
      backgroundColor: 'teal',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
      elevation: 5,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5
    },
    buttonText: {
      fontSize: 14,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'BalsamiqSans-Regular',
    },
    formButton: {
      backgroundColor: '#000',
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
      marginTop: 10,
      borderBottomColor: '#000',
      borderBottomWidth: 0
    },
    secondaryContainer: {
      width: '100%',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    secondaryLink: {
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    // profilePic: {
    //   width: 50,
    //   height: 50,
    //   borderRadius: 25,
    //   marginRight: 15,
    // },
    itemName: {
      flex: 1,
      fontSize: 16,
    },
    actionButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    calendar: {
      flex: 1,
      marginTop: 10,
    },
});

export default ShopScreen;