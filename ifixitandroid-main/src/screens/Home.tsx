// HomeScreen.tsx
import axios from 'axios';
import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type HomeScreenProps = {
  onNavigate: (screen: 'login' | 'quiz' | 'modules' | 'your-location') => void;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any,
  vehicle: number;
  setVehicle: (vehicle: number) => void;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, setLoading, setAlert, user, setVehicle }) => {

  const gridItems = [
    { icon: require('../../assets/images/category_1.png'), screen: 'Bicycle', vehicle: 1 },
    { icon: require('../../assets/images/category_2.png'), screen: 'Motorcycle', vehicle: 2 },
    { icon: require('../../assets/images/category_3.png'), screen: 'Tricycle', vehicle: 3 },
    { icon: require('../../assets/images/category_4.png'), screen: 'Car', vehicle: 4 },
  ];

  return (
    <View style={styles.mainContainer}>
      <View style={styles.gridContainer}>
        {gridItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.box}
            onPress={()=>{
              setVehicle(item.vehicle);
              onNavigate('your-location');
            }}
          >
            <Image 
              source={item.icon} 
              style={styles.image}
            />
            <Text>{item.screen}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50
  },
    mainContainer: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      alignContent: 'center',
      height: '100%',
      width: '100%'
    },
    gridContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: 'white',
      height: 300,
      marginTop: '50%'
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

export default HomeScreen;