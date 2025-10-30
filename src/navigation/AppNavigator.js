import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import VendorNavigator from './VendorNavigator';

// Import screens
import UserTypeScreen from '../screens/UserTypeScreen';
import SplashScreen from '../screens/SplashScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  
  // Simulate checking for stored credentials
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      // If you have stored user credentials, you would check here
      // and set userToken accordingly
    }, 2000); // 2 second splash screen for demo
  }, []);
  
  if (isLoading) {
    // Show splash screen while loading
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          // User is signed in
          <>
            <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
            <Stack.Screen name="VendorApp" component={VendorNavigator} />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="UserType" component={UserTypeScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
            <Stack.Screen name="VendorApp" component={VendorNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;