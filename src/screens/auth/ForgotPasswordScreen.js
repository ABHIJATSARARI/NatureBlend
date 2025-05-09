import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

const ForgotPasswordScreen = ({ navigation, route }) => {
  const { userType } = route.params;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleResetPassword = () => {
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };
  
  const handleResendLink = () => {
    setIsLoading(true);
    
    // Simulate API call for resending reset link
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Image 
              source={require('../../../assets/images/splash-icon.png')} 
              style={styles.logo}
              resizeMode="contain" 
            />
            <Text style={styles.appName}>NatureBlend</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Forgot Password?
            </Text>
            <Text style={styles.subtitle}>
              {!isSent 
                ? 'Enter your email, and we will send you a password reset link'
                : 'We have sent you an email with a link to reset your password'
              }
            </Text>

            {!isSent ? (
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={theme.COLORS.gray} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.resetButton, !email && styles.disabledButton]}
                  onPress={handleResetPassword}
                  disabled={!email || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.COLORS.white} size="small" />
                  ) : (
                    <Text style={styles.resetButtonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={60} color={theme.COLORS.success} />
                </View>
                
                <Text style={styles.instructionText}>
                  Please check your email and follow the instructions to reset your password
                </Text>
                
                <View style={styles.linksContainer}>
                  <TouchableOpacity
                    style={styles.resendLink}
                    onPress={handleResendLink}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={theme.COLORS.primary} size="small" />
                    ) : (
                      <Text style={styles.resendLinkText}>Resend Link</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => navigation.navigate('Login', { userType })}
                >
                  <Text style={styles.resetButtonText}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!isSent && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login', { userType })}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 8,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
    backgroundColor: theme.COLORS.white,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  resetButton: {
    backgroundColor: theme.COLORS.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...theme.SHADOWS.medium,
  },
  disabledButton: {
    backgroundColor: theme.COLORS.lightGray,
    ...theme.SHADOWS.none,
  },
  resetButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    color: theme.COLORS.gray,
    fontSize: 14,
    marginRight: 4,
  },
  signInText: {
    color: theme.COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    color: theme.COLORS.black,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  linksContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  resendLink: {
    padding: 8,
  },
  resendLinkText: {
    color: theme.COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;