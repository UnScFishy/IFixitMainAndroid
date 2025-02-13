// HomeScreen.tsx
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RadioButton } from 'react-native-paper';
import DocumentPicker, { types } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

type SignupScreenProps = {
  onNavigate: (screen: 'signup' | 'login' | 'signup-privacy') => void;
  setUserDetails: any; // Receive the setUserDetails function
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string }) => void
};

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate, setUserDetails, setLoading, setAlert }) => {

  const [base64, setBase64] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    ownerName: '',
    shopName: '',
    username: '',
    phone: '',
    messenger: '',
    role: 'Owner'
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFilePick = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });

      if(file.type !== "application/pdf"){
        setAlert({ show: true, title: 'Error', message: 'Invalid PDF' });
      } else {
        // Convert file URI to base64
        const base64String = await RNFS.readFile(file.uri, 'base64');
        setBase64(`data:${file.type};base64,${base64String}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  const handleSubmit = () => {

    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    const data: any = {
      emailadd: formData.email.replace(/\x00/g, ''),
      password: formData.password.replace(/\x00/g, ''),
      phone: formData.phone.replace(/\x00/g, '')
    };
    if(formData.role === "Owner"){
      data.owner_name = formData.ownerName.replace(/\x00/g, '');
      data.shop_name = formData.shopName.replace(/\x00/g, '');
      data.messenger = formData.messenger.replace(/\x00/g, '');
      data.business_permit = base64;
      data.qrcode = base64Image;
      data.role = 2;
    } else {
      data.username = formData.username.replace(/\x00/g, '');
      data.role = 1;
    }
    axios.post(apiUrl, {
      action: "user-save",
      values: { ...data },
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.data.inserted) {
        setAlert({ show: true, title: 'Success', message: 'Successfully Registered!' });
        onNavigate('login');
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
    }).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };

  const handleImagePick = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });

      if(file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png" ){
        setAlert({ show: true, title: 'Error', message: 'Invalid Image' });
      } else {

        const resizedImage = await ImageResizer.createResizedImage(
          file.uri,       // File URI
          250,             // New width
          250,             // New height
          'JPEG',         // Output format (JPEG, PNG, etc.)
          100,             // Quality (0 to 100)
          0               // Rotation angle
        );

        // Convert file URI to base64
        const base64String = await RNFS.readFile(resizedImage.uri, 'base64');
        setBase64Image(`data:${file.type};base64,${base64String}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  return (
    <View>
      <View style={styles.centeredContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.image} 
        />
        <Text style={[styles.text, styles.textHeader]}>Sign Up</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            <RadioButton
              value="owner"
              status={formData.role === 'Owner' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('role', 'Owner')}
            />
            <Text style={styles.radioLabel}>Owner</Text>
          </View>

          <View style={styles.radioItem}>
            <RadioButton
              value="customer"
              status={formData.role === 'Customer' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('role', 'Customer')}
            />
            <Text style={styles.radioLabel}>Customer</Text>
          </View>
        </View>
        {formData.role === 'Owner' &&
          <>
            <TextInput
              style={styles.textInputIcon}
              placeholder="Shop Name"
          placeholderTextColor="#888"
              value={formData.shopName}
              onChangeText={(text) => handleChange('shopName', text)}
            />
            <TextInput
              style={styles.textInputIcon}
              placeholder="Owner Name"
          placeholderTextColor="#888"
              value={formData.ownerName}
              onChangeText={(text) => handleChange('ownerName', text)}
            />
          </>
        }

        {formData.role === 'Customer' &&
          <>
            <TextInput
              style={styles.textInputIcon}
              placeholder="Username"
          placeholderTextColor="#888"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
            />
          </>
        }
        <TextInput
          style={styles.textInputIcon}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          style={styles.textInputIcon}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInputIcon}
          placeholder="Password"
          placeholderTextColor="#888"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        {formData.role === 'Owner' &&
          <>
            <TextInput
              style={styles.textInputIcon}
              placeholder="Messenger"
              placeholderTextColor="#888"
              value={formData.messenger}
              onChangeText={(text) => handleChange('messenger', text)}
            />

            <Text style={[styles.textLabel, styles.text]}>Business Permit</Text>
            {base64 ? (
              <Text>PDF already Selected</Text>
            ) : (
              <TouchableOpacity style={styles.button}  onPress={handleFilePick}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            )}
            
            {base64 ? (
              null
              // <WebView
              //   originWhitelist={['*']}
              //   source={{ uri: base64 }}
              //   style={styles.webview}
              // />
            ) : (
              <Text>No PDF Selected</Text>
            )}

            <Text style={[styles.textLabel, styles.text]}>GASH QR Code</Text>
            {base64Image ? (
              <Text>QR Code already Selected</Text>
            ) : (
              <TouchableOpacity style={styles.button}  onPress={handleImagePick}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            )}
            
            {base64Image ? (
              null
              // <WebView
              //   originWhitelist={['*']}
              //   source={{ uri: base64 }}
              //   style={styles.webview}
              // />
            ) : (
              <Text>No QR Code Selected</Text>
            )}
          </>
        }
        <TouchableOpacity style={styles.formButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('login')}>
        <Text style={[styles.secondaryLink, styles.text]}>Already have an account? Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('signup-privacy')}>
        <Text style={[styles.secondaryLink, styles.text]}>By signing up, you agree to our </Text>
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
    borderColor: 'black',
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
    paddingBottom: 3,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    marginBottom: 15,
  },
  textLabel: {
    marginTop: 10
  },
  text: {
    fontFamily: 'BalsamiqSans-Regular',
  },
  textInput: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: 'BalsamiqSans-Italic',
    marginBottom: 15
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
    fontSize: 12,
    fontFamily: 'BalsamiqSans-Italic',
    marginBottom: 10,
    color: '#000'
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
    marginBottom: 30,
  },
  secondaryLink: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 18,
    marginLeft: 10,
  },
  selectedValue: {
    fontSize: 18,
    marginTop: 20,
  },
  link: {
    color: 'teal'
  }
});

export default SignupScreen;