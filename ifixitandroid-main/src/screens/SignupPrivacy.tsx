// SignupPrivacy.tsx
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

type SignupPrivacyProps = {
  onNavigate: (screen: 'signup' | 'login' | 'forgotpassword' | 'pretest' | 'home' | 'adminHome' | 'shop-location' | 'your-location' | 'customer-location' | 'signup-privacy') => void;
};

const SignupPrivacy: React.FC<SignupPrivacyProps> = ({ onNavigate }) => {

  return (
    <View>
      <View style={styles.centeredContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.image} 
        />
        <Text style={[styles.textHeader]}>Data Privacy and Terms of Service</Text>

        <View style={styles.textContainer}>
          <Text style={styles.sectionHeader}>Data Privacy Policy</Text>
          <Text style={styles.textBody}>
            Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when using our app to book repair services for your vehicle.
            {'\n\n'}
            <Text style={styles.textBold}>Information We Collect:</Text> We collect personal information, including your name, phone number, email address, and vehicle details, to provide you with the necessary repair services.
            {'\n\n'}
            <Text style={styles.textBold}>How We Use Your Information:</Text> Your information will be used exclusively for booking repairs, communicating with technicians, and providing updates about your service request.
            {'\n\n'}
            <Text style={styles.textBold}>Third-Party Services:</Text> We may share your information with repair technicians and shop owners to fulfill your service request. Your data will not be sold or shared with third parties without your consent, except as required by law.
            {'\n\n'}
            <Text style={styles.textBold}>Data Security:</Text> We implement strict security measures to protect your personal data from unauthorized access, alteration, or destruction.
            {'\n\n'}
            By using this app, you agree to our data collection and privacy practices as outlined above.
          </Text>

          <Text style={styles.sectionHeader}>Terms of Service</Text>
          <Text style={styles.textBody}>
            Welcome to our repair booking service! By using our app to book repair services, you agree to the following terms:
            {'\n\n'}
            <Text style={styles.textBold}>Service Description:</Text> Our app allows you to book repair services for your vehicle. A technician will be assigned to your location to perform the necessary repairs.
            {'\n\n'}
            <Text style={styles.textBold}>User Responsibilities:</Text> You are responsible for providing accurate information, including vehicle details and location. You must ensure that the repair location is accessible to the technician.
            {'\n\n'}
            <Text style={styles.textBold}>Payment and Fees:</Text> Payment for services is due at the time of service. Any additional charges will be communicated to you beforehand.
            {'\n\n'}
            <Text style={styles.textBold}>Technician and Shop Responsibilities:</Text> Technicians will provide the services as per the request. Shop owners are responsible for providing business permits and a contact link (e.g., messenger link) for communication.
            {'\n\n'}
            <Text style={styles.textBold}>Liability:</Text> We are not liable for any damages or injuries that may occur during the repair process. Our technicians are independent contractors and operate under their own insurance and liability policies.
            {'\n\n'}
            <Text style={styles.textBold}>Termination:</Text> We reserve the right to suspend or terminate access to our app for users who violate our terms or engage in inappropriate behavior.
            {'\n\n'}
            By continuing to use our app, you agree to these Terms of Service.
          </Text>
        </View>

      </View>
      <TouchableOpacity style={styles.secondaryContainer} onPress={() => onNavigate('signup')}>
        <Text style={[styles.secondaryLink]}>Back to Registration</Text>
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
    justifyContent: 'center',
  },
  textHeader: {
    textAlign: 'center',
    width: '100%',
    padding: 1,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
    marginBottom: 15,
  },
  textContainer: {
    marginHorizontal: 20,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    color: 'black',
  },
  textBody: {
    fontSize: 14,
    lineHeight: 22,
    color: 'gray',
    marginTop: 10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  secondaryContainer: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryLink: {
    color: 'teal',
  },
  scrollView: {
    paddingBottom: 20,
  },
});

export default SignupPrivacy;