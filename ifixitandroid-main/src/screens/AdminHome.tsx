// HomeScreen.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

type AdminHomeScreenProps = {
  onNavigate: (screen: string) => void;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any
};

const AdminHomeScreen: React.FC<AdminHomeScreenProps> = ({ onNavigate, setLoading, setAlert, user }) => {
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    profilePic: user.profilePic
  });

  const [students, setStudents] = useState([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // const getProfile = () => {
  //   setLoading(true);
  //   const apiUrl = 'http://localhost:3000/api/user/get-profile';
  //   const apiUrl2 = 'http://localhost:3000/api/section/get-students-section';

  //   axios.get(apiUrl).then(response => {
  //     if(response.status === 200){
        
  //       axios.get(apiUrl2 + "?sectionName="+response.data.data.section).then(response => {
  //         if(response.status === 200){
  //           setStudents(response.data.data);
  //         } else {
  //           setAlert({ show: true, title: 'Error', message: response.data.error });
  //         }
  //       }).catch(error => {
  //         if (error.response) {
  //           setAlert({ show: true, title: 'Error', message: error.response.data.error });
  //         } else {
  //           setAlert({ show: true, title: 'Error', message: 'Network Error' });
  //           console.log('Error:', error.message);
  //         }
  //       }).finally(()=>{
  //         setTimeout(()=>{
  //           setLoading(false);
  //         }, 1000);
  //       });

  //     } else {
  //       setAlert({ show: true, title: 'Error', message: response.data.error });
  //       setTimeout(()=>{
  //         setLoading(false);
  //       }, 1000);
  //     }
  //   }).catch(error => {
  //     if (error.response) {
  //       setAlert({ show: true, title: 'Error', message: error.response.data.error });
  //     } else {
  //       setAlert({ show: true, title: 'Error', message: 'Network Error' });
  //       console.log('Error:', error.message);
  //     }
  //     setTimeout(()=>{
  //       setLoading(false);
  //     }, 1000);
  //   })
  // };

  // useEffect(()=>{
  //   getProfile();
  // }, []);
  
  return (
    <View>
      <View style={styles.centeredContainer}>
        <Text style={[styles.text, styles.textHeader]}>Welcome Admin, {user.firstName}</Text>
        
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
});

export default AdminHomeScreen;