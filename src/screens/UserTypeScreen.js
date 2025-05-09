import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../constants/theme';

const { width } = Dimensions.get('window');

const UserTypeScreen = ({ navigation }) => {
  const handleUserTypeSelection = (userType) => {
    // Navigate to Auth navigator first, passing userType as a parameter
    navigation.navigate('Auth', { userType });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/logo1.png')} 
              style={styles.logo}
              resizeMode="contain" 
            />
            <Text style={styles.appName}>NatureBlend</Text>
            <Text style={styles.tagline}>Natural wellness marketplace</Text>
          </View>

          <Text style={styles.title}>
            Are you a customer or vendor?
          </Text>
          <Text style={styles.subtitle}>
            Choose your account type to continue
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => handleUserTypeSelection('customer')}
            >
              <View style={[styles.iconContainer, styles.customerIcon]}>
                <Ionicons name="person" size={32} color={theme.COLORS.primary} />
              </View>
              <Text style={styles.optionTitle}>Customer</Text>
              <Text style={styles.optionDescription}>
                Browse and purchase natural products from verified vendors
              </Text>
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitItem}>
                  <Ionicons name="leaf" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.benefitText}>Discover natural products</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="shield-checkmark" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.benefitText}>Quality assurance</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="calendar" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.benefitText}>Book wellness sessions</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.button, styles.customerButton]}
                onPress={() => handleUserTypeSelection('customer')}
              >
                <Text style={styles.buttonText}>Continue as Customer</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionCard}
              onPress={() => handleUserTypeSelection('vendor')}
            >
              <View style={[styles.iconContainer, styles.vendorIcon]}>
                <Ionicons name="briefcase" size={32} color={theme.COLORS.secondary} />
              </View>
              <Text style={[styles.optionTitle, styles.vendorTitle]}>Vendor</Text>
              <Text style={styles.optionDescription}>
                Sell your natural wellness products to conscious consumers
              </Text>
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitItem}>
                  <Ionicons name="storefront" size={16} color={theme.COLORS.secondary} />
                  <Text style={styles.benefitText}>Manage your online store</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="stats-chart" size={16} color={theme.COLORS.secondary} />
                  <Text style={styles.benefitText}>Track sales analytics</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="wallet" size={16} color={theme.COLORS.secondary} />
                  <Text style={styles.benefitText}>Fast & secure payments</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.button, styles.vendorButton]}
                onPress={() => handleUserTypeSelection('vendor')}
              >
                <Text style={styles.buttonText}>Continue as Vendor</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our{' '}
                <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  tagline: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginBottom: 20,
    ...theme.SHADOWS.medium,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  customerIcon: {
    backgroundColor: 'rgba(58, 158, 96, 0.1)',
  },
  vendorIcon: {
    backgroundColor: 'rgba(73, 165, 120, 0.1)',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: 8,
  },
  vendorTitle: {
    color: theme.COLORS.secondary,
  },
  optionDescription: {
    fontSize: 14,
    color: theme.COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  benefitsContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerButton: {
    backgroundColor: theme.COLORS.primary,
  },
  vendorButton: {
    backgroundColor: theme.COLORS.secondary,
  },
  buttonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  footerLink: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
});

export default UserTypeScreen;