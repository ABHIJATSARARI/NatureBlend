import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


const PaymentScreen = ({ route, navigation }) => {
  const { totalAmount = 78.96 } = route.params || {};
  
  const [activeTab, setActiveTab] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  
  const formatCardNumber = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };
  
  const handleCardNumberChange = (text) => {
    setCardNumber(formatCardNumber(text));
  };
  
  const handleExpiryDateChange = (text) => {
    setExpiryDate(formatExpiryDate(text));
  };
  
  const handleCvvChange = (text) => {
    // Limit to 3 or 4 digits
    setCvv(text.replace(/\D/g, '').slice(0, 4));
  };
  
  const validateForm = () => {
    if (activeTab === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card Number', 'Please enter a valid card number.');
        return false;
      }
      
      if (!cardName) {
        Alert.alert('Missing Information', 'Please enter the name on your card.');
        return false;
      }
      
      if (!expiryDate || expiryDate.length < 5) {
        Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date.');
        return false;
      }
      
      if (!cvv || cvv.length < 3) {
        Alert.alert('Invalid CVV', 'Please enter a valid CVV code.');
        return false;
      }
    }
    
    return true;
  };
  
  const handlePayment = () => {
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would call a payment processing API
    
    Alert.alert(
      'Payment Successful',
      `Your payment of $${totalAmount.toFixed(2)} was successful!`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('OrderConfirmation', {
              orderId: 'NB' + Math.floor(100000 + Math.random() * 900000),
              totalAmount,
              estimatedDelivery: '3-5 business days',
            });
          },
        },
      ]
    );
  };
  
  const getCardType = () => {
    // Simple card type detection based on first digit
    const firstDigit = cardNumber.replace(/\s/g, '').charAt(0);
    
    if (firstDigit === '4') {
      return 'visa';
    } else if (firstDigit === '5') {
      return 'mastercard';
    } else if (firstDigit === '3') {
      return 'amex';
    } else if (firstDigit === '6') {
      return 'discover';
    }
    
    return 'unknown';
  };
  
  const getCardIcon = () => {
    const cardType = getCardType();
    
    switch (cardType) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card-outline';
      case 'amex':
        return 'card';
      case 'discover':
        return 'card-outline';
      default:
        return 'card';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Summary */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Payment</Text>
          <Text style={styles.amount}>${totalAmount.toFixed(2)}</Text>
        </View>
        
        {/* Payment Method Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'card' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('card')}
          >
            <Ionicons 
              name="card" 
              size={20} 
              color={activeTab === 'card' ? theme.COLORS.primary : theme.COLORS.gray} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'card' && styles.activeTabText,
              ]}
            >
              Credit/Debit Card
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'wallet' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('wallet')}
          >
            <Ionicons 
              name="wallet" 
              size={20} 
              color={activeTab === 'wallet' ? theme.COLORS.primary : theme.COLORS.gray} 
            />
            <Text 
              style={[
                styles.tabText,
                activeTab === 'wallet' && styles.activeTabText,
              ]}
            >
              NatureBlend Wallet
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Card Payment Form */}
        {activeTab === 'card' && (
          <View style={styles.paymentForm}>
            <View style={styles.formField}>
              <Text style={styles.label}>Card Number</Text>
              <View style={styles.cardNumberContainer}>
                <TextInput
                  style={styles.cardNumberInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {cardNumber.length > 0 && (
                  <Ionicons 
                    name={getCardIcon()} 
                    size={24} 
                    color={theme.COLORS.primary} 
                    style={styles.cardIcon} 
                  />
                )}
              </View>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.label}>Name on Card</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.rowFields}>
              <View style={[styles.formField, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={handleCvvChange}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry={true}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveCardContainer}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[
                styles.checkbox,
                saveCard && styles.checkboxChecked,
              ]}>
                {saveCard && <Ionicons name="checkmark" size={16} color={theme.COLORS.white} />}
              </View>
              <Text style={styles.saveCardText}>Save card for future payments</Text>
            </TouchableOpacity>
            
            <View style={styles.securePaymentContainer}>
              <Ionicons name="lock-closed" size={16} color={theme.COLORS.gray} />
              <Text style={styles.securePaymentText}>
                Secure payment processed by our trusted payment partner
              </Text>
            </View>
          </View>
        )}
        
        {/* Wallet Payment */}
        {activeTab === 'wallet' && (
          <View style={styles.walletContainer}>
            <View style={styles.walletCard}>
              <View style={styles.walletBalanceContainer}>
                <Text style={styles.walletBalanceLabel}>Available Balance</Text>
                <Text style={styles.walletBalance}>$125.50</Text>
              </View>
              
              <View style={styles.walletInfo}>
                <Ionicons name="leaf" size={20} color={theme.COLORS.white} />
                <Text style={styles.walletInfoText}>
                  Earn 5% cashback on sustainable products
                </Text>
              </View>
            </View>
            
            <View style={styles.messageBox}>
              <Ionicons name="information-circle" size={20} color={theme.COLORS.info} />
              <Text style={styles.messageText}>
                {totalAmount <= 125.50 
                  ? 'Your wallet has sufficient balance for this transaction.' 
                  : 'Your wallet balance is insufficient. Please add funds or choose a different payment method.'}
              </Text>
            </View>
            
            {totalAmount > 125.50 && (
              <TouchableOpacity style={styles.topUpButton}>
                <Text style={styles.topUpButtonText}>Top Up Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Pay Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            (activeTab === 'wallet' && totalAmount > 125.50) && styles.disabledButton
          ]}
          onPress={handlePayment}
          disabled={activeTab === 'wallet' && totalAmount > 125.50}
        >
          <Text style={styles.payButtonText}>Pay ${totalAmount.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    backgroundColor: theme.COLORS.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: theme.COLORS.white,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginLeft: 8,
  },
  activeTabText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  paymentForm: {
    marginBottom: 24,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  cardNumberInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  cardIcon: {
    marginLeft: 8,
  },
  rowFields: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  saveCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.COLORS.primary,
  },
  saveCardText: {
    fontSize: 14,
    color: theme.COLORS.black,
  },
  securePaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    padding: 12,
  },
  securePaymentText: {
    fontSize: 13,
    color: theme.COLORS.gray,
    marginLeft: 8,
    flex: 1,
  },
  walletContainer: {
    marginBottom: 24,
  },
  walletCard: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  walletBalanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  walletBalanceLabel: {
    fontSize: 14,
    color: theme.COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  walletInfoText: {
    fontSize: 13,
    color: theme.COLORS.white,
    marginLeft: 8,
    flex: 1,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.info + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 13,
    color: theme.COLORS.darkGray,
    marginLeft: 8,
    flex: 1,
  },
  topUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  topUpButtonText: {
    color: theme.COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.ultraLightGray,
  },
  payButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.COLORS.lightGray,
  },
  payButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;