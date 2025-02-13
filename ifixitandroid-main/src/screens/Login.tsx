// LoginScreen.tsx
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

type LoginScreenProps = {
  onNavigate: (screen: 'signup' | 'login' | 'forgotpassword' | 'pretest' | 'home' | 'adminHome' | 'shop-location' | 'your-location' | 'customer-location' | 'login-privacy') => void;
  setUserDetails: any; // Receive the setUserDetails function
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, setUserDetails, setLoading, setAlert }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: 'login',
      values: {
        emailadd: formData.email.replace(/\x00/g, ''),
        password: formData.password.replace(/\x00/g, '')
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if(response.data.logged_in && response.data.record){
        setUserDetails({ role: response.data.record.role });
        if(response.data.record.role === 2){
          onNavigate('customer-location');
        } else {
          onNavigate('home');
        }
      } else {
        setAlert({ show: true, title: 'Error', message: response.data.error });
      }
    }).catch(error => {
      console.log(error);
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

  return (
    <View>
      <View style={styles.centeredContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.image} 
        />
        <Text style={[styles.text, styles.textHeader]}>Log In</Text>
        <TextInput
          style={styles.textInputIcon}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInputIcon}
          placeholder="Password"
          placeholderTextColor="#888"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TouchableOpacity style={styles.formButton}  onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('signup')}>
        <Text style={[styles.secondaryLink, styles.text]}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('login-privacy')}>
        <Text style={[styles.secondaryLink, styles.text]}>By logging in, you agree to our </Text>
        <Text style={[styles.link]}>data privacy policy and terms of service.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: 50,
  },
    centeredContainer: {
        marginTop: 50,
        marginBottom: 10,
        backgroundColor: 'white',
        padding: 20,
        overflow: 'hidden',
        flexDirection: 'column', 
        alignItems: 'center',
      justifyContent: 'center'
    },
    textHeader: {
      textAlign: 'center',
      width: '100%',
      padding: 1,
      paddingBottom: 5,
      fontWeight: 'bold',
      color: 'black',
      fontSize: 18,
      marginBottom: 15
    },
    textLabel: {
      marginTop: 10
    },
    text: {
    },
    textIconWrapper: {
      position: 'relative',
      width: '100%'
    },
    textIcon: {
      position: 'absolute',
      left: 10,
      top: 8
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
    secondaryContainer: {
      width: '100%',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    secondaryLink: {
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    link: {
      color: 'teal'
    }
});

export default LoginScreen;