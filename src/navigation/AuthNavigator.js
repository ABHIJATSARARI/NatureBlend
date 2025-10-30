import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = ({ route }) => {
  const { userType } = route.params || { userType: 'customer' };

  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        initialParams={{ userType }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        initialParams={{ userType }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        initialParams={{ userType }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;