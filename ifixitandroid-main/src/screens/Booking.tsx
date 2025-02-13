// BookingScreen.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';

type BookingScreenProps = {
  onNavigate: (screen: 'login' | 'home' | 'modules' | 'payment' | 'customer-location' | 'history') => void;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any;
  booking: string;
};

const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate, setLoading, setAlert, user, booking }) => {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const getBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'get-bookings-by-id',
      values: {
        'booking_id': booking
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setActiveBooking(response.data);
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

  const acceptBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'accept-or-decline-service',
      values: {
        'booking_id': booking,
        'status': 2
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(!response.data.error){
        setAlert({ show: true, title: 'Success', message: response.data.message });
        getBooking();
      }
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

  const denyBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'accept-or-decline-service',
      values: {
        'booking_id': booking,
        'status': 3
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(!response.data.error){
        setAlert({ show: true, title: 'Success', message: response.data.message });
        onNavigate('customer-location');
      }
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

  const completeBooking = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'accept-or-decline-service',
      values: {
        'booking_id': booking,
        'status': 5
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(!response.data.error){
        setAlert({ show: true, title: 'Success', message: 'Service completed' });
        onNavigate('history');
      }
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
    getBooking();
  }, []);

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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.listContainer}>

        { activeBooking &&
          <>
            <View style={styles.listItem}>
              <Text>Shop Name: {activeBooking.shop_name}</Text>
              <Text>MechanicId: {activeBooking.shop_id}</Text>
              <Text>Date: {activeBooking.date}</Text>
              <Text>category: {vehicleTypeMapping[activeBooking.category] || "Unknown"}</Text>
              <Text>status: {statusMapping[activeBooking.status] || "Unknown"}</Text>
              <Text>issue: {activeBooking.issue}</Text>
            </View>
            {
              activeBooking.status === 1 && 
              <View style={{ flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity style={styles.button} onPress={acceptBooking}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={denyBooking}>
                  <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
            </View>
            }
            {
              activeBooking.status === 4 && 
              <View style={{ flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity style={styles.button} onPress={completeBooking}>
                  <Text style={styles.buttonText}>Complete</Text>
                </TouchableOpacity>
            </View>
            }
          </>
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

export default BookingScreen;