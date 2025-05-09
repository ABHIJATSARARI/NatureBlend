import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import theme from '../constants/theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.COLORS.primary} />
      <View style={styles.contentContainer}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>NatureBlend</Text>
        <Text style={styles.tagline}>Natural wellness marketplace</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.COLORS.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.COLORS.white,
    opacity: 0.8,
  },
});

export default SplashScreen;