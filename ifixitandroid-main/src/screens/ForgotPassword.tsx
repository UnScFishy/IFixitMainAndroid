// ForgotPasswordScreen.tsx
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type ForgotPasswordScreenProps = {
  onNavigate: (screen: 'login') => void;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate, setLoading, setAlert }) => {

  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:3000/api/user/reset-password';

    axios.post(apiUrl, {
      email: formData.email.replace(/\x00/g, ''),
    }).then(response => {
      // handling success flow - kapag gumagana ung server, at  tama ung result, dito dadaan (ito ung next nababsahin ni computer)
      if(response.status === 200){
        setAlert({ show: true, title: 'Success', message: 'Your new password has been sent to your email.' });
      } else {
        // handling error flow- kapag gumagana ung server, at mali ung result, dito dadaan (ito ung next nababsahin ni computer)
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
        <Text style={[styles.text, styles.textHeader]}>RESET PASSWORD</Text>
        <Text style={[styles.textLabel, styles.text]}>Email Address </Text>
        <View style={styles.textIconWrapper}>
          <Icon name="mail" size={14} color="#000" style={styles.textIcon} />
          <TextInput
            style={styles.textInputIcon}
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
         </View>
        <TouchableOpacity style={styles.formButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
     </View>
        <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('login')}>
        <Text style={[styles.secondaryLink, styles.text]}>Back to Login</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
    centeredContainer: {
        marginTop: 150,
        marginBottom: 10,
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
      marginTop: 10
    },
    text: {
      fontFamily: 'BalsamiqSans-Regular',
    },
    textInput: {
      width: '100%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      paddingLeft: 30,
      fontSize: 12,
      fontFamily: 'BalsamiqSans-Italic',
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
      width: '100%',
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      paddingLeft: 30,
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
    }
});

export default ForgotPasswordScreen;

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
