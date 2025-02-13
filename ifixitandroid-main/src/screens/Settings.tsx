// HomeScreen.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

type SettingsScreenProps = {
  onNavigate: (screen: string) => void;
  setUserDetails: any;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, setUserDetails, setLoading, setAlert, user }) => {

  const [quarters, setQuarters] = useState([]);

  const getQuarters = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:3000/api/section/fetch-all-quarters';

    axios.get(apiUrl).then(response => {
      if(response.status === 200){
        setQuarters(response.data.data);
      } else {
        setAlert({ show: true, title: 'Error', message: response.data.error });
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
    getQuarters();
  }, []);

  const handleSubmit = (id: string) => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:3000/api/section/change-quarter';

    axios.post(apiUrl, {
      quarterId: id,
    }).then(response => {
      if(response.status === 200){
        setAlert({ show: true, title: 'Success', message: 'Successfully Updated!' });
        getQuarters();
      } else {
        setAlert({ show: true, title: 'Error', message: response.data.error });
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
  
  return (
    <View>
      <View style={styles.centeredContainer}>
        <Text style={[styles.text, styles.textHeader]}>Quarters</Text>
        {quarters.map((item: any) => (
          <View key={item._id} style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <RadioButton
              value={item.id}
              status={item.isActive ? 'checked' : 'unchecked'}
              onPress={() => handleSubmit(item.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
      borderBottomColor: '#4F7C82'
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
      alignItems: 'center'
    },
    buttonText: {
      fontSize: 14,
      color: 'white',
      textAlign: 'center',
      fontFamily: 'BalsamiqSans-Regular',
    },
    formButton: {
      backgroundColor: '#48CFAD',
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
      marginTop: 20,
      borderBottomColor: '#37BC9B',
      borderBottomWidth: 5
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
    textInput: {
      width: '100%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 12,
      fontFamily: 'BalsamiqSans-Italic',
    },
    profilePic: {
      width: 100,  // Set the desired size of the profile picture
      height: 100,
      borderRadius: 50, // Makes it a circle
      borderWidth: 2,
      borderColor: '#ddd',
    },
    imageContainer: {
      position: 'relative',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: 10
    },
    editIcon: {
      position: 'absolute',
      left: '60%',
      bottom: 10
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    itemName: {
      flex: 1,
      fontSize: 16,
    },
});

export default SettingsScreen;