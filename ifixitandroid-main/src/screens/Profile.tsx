// HomeScreen.tsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Checkbox } from 'react-native-paper';
import DocumentPicker, { types } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import ImageResizer from 'react-native-image-resizer';

Icon.loadFont();

type ProfileScreenProps = {
  onNavigate: (screen: 'login' | 'shop-location') => void;
  setUserDetails: any;
  setLoading: (loading: boolean) => void; // Receive the setLoading function
  setAlert: (alert: { show: boolean, title: string, message: string}) => void;
  user: any;
  shopLocation: { latitude: number, longitude: number };
  setShopLocation: (shopLocation: { latitude: number, longitude: number }) => void;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, setUserDetails, setLoading, setAlert, user, shopLocation, setShopLocation }) => {
  
  const [base64, setBase64] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessPermit: '',
    location: '',
    qrCode: '',
    services: [] as number[],
    profilePic: '',
    role: 1
  });

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
          50,             // New width
          50,             // New height
          'JPEG',         // Output format (JPEG, PNG, etc.)
          80,             // Quality (0 to 100)
          0               // Rotation angle
        );

        // Convert file URI to base64
        const base64String = await RNFS.readFile(resizedImage.uri, 'base64');
        setBase64Image(`data:${file.type};base64,${base64String}`);
        handleChange('profilePic', `data:${file.type};base64,${base64String}`);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const getProfile = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    axios.post(apiUrl, {
      action: user.role === 1 ? "profile-fetch" : "shop-fetch",
      values: {}
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response.data)
      if(response.data.role === 2){
        setFormData({
          name: response.data.shop_name,
          phone: response.data.phone,
          email: response.data.emailadd,
          businessPermit: response.data.business_permit,
          location: response.data.location,
          qrCode: response.data.qrcode,
          services: response.data.services ? response.data.services : [],
          profilePic: response.data.profile_pic,
          role: response.data.role
        });
        setBase64(response.data.business_permit);
        setBase64Image(response.data.profile_pic);
      } else {
        setFormData({
          name: response.data.username,
          phone: response.data.phone,
          email: response.data.email,
          businessPermit: '',
          location: '',
          qrCode: '',
          services: [],
          profilePic: response.data.profile_pic,
          role: response.data.role
        });
        setBase64Image(response.data.profile_pic);
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
    getProfile();
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = 'http://174.138.43.212:8000/classes/class.main.php';
    const customerData = {
      action: 'profile-save',
      values: {
        emailadd: formData.email,
        phone: formData.phone,
        profile_pic: base64Image,
        username: formData.name
      }
    };
    const shopData = {
      action: 'shop-save',
      values: {
        shop_name: formData.name,
        emailadd: formData.email,
        phone: formData.phone,
        profile_pic: base64Image,
        business_permit: base64,
        services: formData.services,
        qrcode: formData.qrCode,
        latitude: shopLocation.latitude,
        longitude: shopLocation.longitude
      }
    }
    axios.post(apiUrl, formData.role === 1? customerData : shopData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
      if(response.data.success){
        setAlert({ show: true, title: 'Success', message: response.data.message });
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

  const toggleServices = (id: number) => {
    if (formData.services.includes(id)) {
      // Remove the id from services
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter(service => service !== id),
      }));
    } else {
      // Add the id to services
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, id],
      }));
    }
  };
  
  return (
    <View>
      <View style={styles.centeredContainer}>
        <View style={styles.imageContainer}>
          { base64Image && 
            <Image
              source={{ uri: formData.profilePic }}
              style={styles.profilePic}
            />
          }
          <Icon name="edit" size={14} color="#000" style={styles.editIcon} onPress={handleImagePick} />
        </View>
        <Text style={[styles.textLabel, styles.text]}>Name </Text>
        <View style={styles.textIconWrapper}>
          <Icon name="edit-2" size={14} color="#000" style={styles.textIcon} />
          <TextInput
            style={styles.textInputIcon}
            placeholder=""
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>
        <Text style={[styles.textLabel, styles.text]}>Phone Number </Text>
        <View style={styles.textIconWrapper}>
          <Icon name="phone" size={14} color="#000" style={styles.textIcon} />
          <TextInput
            style={styles.textInputIcon}
            placeholder=""
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />
        </View>
        <Text style={[styles.textLabel, styles.text]}>Email Address</Text>
        <View style={styles.textIconWrapper}>
          <Icon name="mail" size={14} color="#000" style={styles.textIcon} />
          <TextInput
            style={styles.textInputIcon}
            placeholder=""
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>

        { user.role === 2 && 
          <>
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
              <Text style={[styles.textLabel, styles.text]}>Shop Location</Text>
              <TouchableOpacity style={styles.button} onPress={()=>{
                onNavigate('shop-location');
              }}>
                <Text style={styles.buttonText}>Pin Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>

              <Text style={[styles.textLabel, styles.text]}>Services</Text>
              <View style={styles.checkboxGroup}>
                <View style={styles.checkboxItem}>
                  <Checkbox
                    status={formData.services?.includes(1) ? 'checked' : 'unchecked'}
                    onPress={()=>{toggleServices(1);}}
                  />
                  <Text style={styles.checkboxLabel}>Bicycle</Text>
                </View>

                <View style={styles.checkboxItem}>
                  <Checkbox
                    status={formData.services?.includes(2) ? 'checked' : 'unchecked'}
                    onPress={()=>{toggleServices(2);}}
                  />
                  <Text style={styles.checkboxLabel}>Trycicle</Text>
                </View>

                <View style={styles.checkboxItem}>
                  <Checkbox
                    status={formData.services?.includes(3) ? 'checked' : 'unchecked'}
                    onPress={()=>{toggleServices(3);}}
                  />
                  <Text style={styles.checkboxLabel}>Motorcycle</Text>
                </View>

                <View style={styles.checkboxItem}>
                  <Checkbox
                    status={formData.services?.includes(4) ? 'checked' : 'unchecked'}
                    onPress={()=>{toggleServices(4);}}
                  />
                  <Text style={styles.checkboxLabel}>Car</Text>
                </View>
              </View>
          </>
        }

        <TouchableOpacity style={styles.formButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    width: 150,
    height: 150
  },
    centeredContainer: {
        marginTop: 75,
        marginBottom: 70,
        backgroundColor: 'white',
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
    textInput: {
      width: '100%',
      borderBottomWidth: 2,
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
      borderBottomWidth: 2,
      borderColor: 'black',
      paddingVertical: 5,
      paddingHorizontal: 10,
      paddingLeft: 30,
      fontSize: 12,
      fontFamily: 'BalsamiqSans-Italic',
    },
    checkboxGroup: {
      flexDirection: 'column',
    },
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    checkboxLabel: {
      fontSize: 18,
      marginLeft: 10,
    },
});

export default ProfileScreen;