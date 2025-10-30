import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// Import theme
import theme from '../../constants/theme';

// Dummy data for checkout
const cartItems = [
  {
    id: 'prod1',
    name: 'Organic Wellness Tea',
    image: require('../../../assets/images/splash-icon.png'),
    price: 24.99,
    quantity: 2,
    vendorName: 'Herbal Haven',
    sustainability: 92,
  },
  {
    id: 'prod2',
    name: 'Natural Face Serum',
    image: require('../../../assets/images/splash-icon.png'),
    price: 34.99,
    quantity: 1,
    vendorName: 'Pure Beauty Co.',
    sustainability: 85,
  },
  {
    id: 'prod3',
    name: 'Bamboo Toothbrush Set',
    image: require('../../../assets/images/splash-icon.png'),
    price: 15.49,
    quantity: 3,
    vendorName: 'EcoLife Products',
    sustainability: 97,
  },
];

const shippingOptions = [
  {
    id: 'shipping1',
    name: 'Standard Shipping',
    price: 4.99,
    estimatedDays: '3-5 days',
    isEco: false,
  },
  {
    id: 'shipping2',
    name: 'Express Shipping',
    price: 9.99,
    estimatedDays: '1-2 days',
    isEco: false,
  },
  {
    id: 'shipping3',
    name: 'Eco-Friendly Shipping',
    price: 6.99,
    estimatedDays: '4-6 days',
    isEco: true,
  },
];

const paymentMethods = [
  {
    id: 'card1',
    type: 'visa',
    last4: '4242',
    expiryDate: '05/26',
  },
  {
    id: 'card2',
    type: 'mastercard',
    last4: '8797',
    expiryDate: '11/25',
  },
  {
    id: 'wallet',
    type: 'wallet',
    balance: 125.50,
  },
];

const CheckoutScreen = ({ navigation }) => {
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: 'Alex Johnson',
    street: '123 Wellness Ave',
    city: 'Greenville',
    state: 'CA',
    zipCode: '90210',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  });
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon.amount : 0;
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const totalAmount = subtotal + shippingCost + tax - discount;
  
  const handleApplyCoupon = () => {
    // Simulating coupon application
    const newCoupon = {
      code: 'NATURE20',
      amount: 10,
    };
    
    setAppliedCoupon(newCoupon);
    Alert.alert('Coupon Applied', `Coupon NATURE20 for $10 off has been applied!`);
  };
  
  const handleChangeAddress = () => {
    navigation.navigate('DeliveryAddresses');
  };
  
  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };
  
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', {
        orderId: 'NB' + Math.floor(100000 + Math.random() * 900000),
        totalAmount,
        estimatedDelivery: selectedShipping.estimatedDays,
      });
    }, 2000);
  };
  
  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={item.image} style={styles.productImage} />
      
      <View style={styles.productDetails}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.vendorName}>{item.vendorName}</Text>
          
          <View style={styles.sustainabilityBadge}>
            <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
            <Text style={styles.sustainabilityScore}>{item.sustainability}%</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
          <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
  
  const renderShippingOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        selectedShipping?.id === option.id && styles.selectedOptionCard,
      ]}
      onPress={() => setSelectedShipping(option)}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionMainInfo}>
          <View style={styles.optionTitleRow}>
            <Text style={styles.optionTitle}>{option.name}</Text>
            {option.isEco && (
              <View style={styles.ecoTag}>
                <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
                <Text style={styles.ecoText}>Eco</Text>
              </View>
            )}
          </View>
          <Text style={styles.deliveryEstimate}>{option.estimatedDays}</Text>
        </View>
        
        <Text style={styles.optionPrice}>${option.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.radioContainer}>
        <View 
          style={[
            styles.radioOuter,
            selectedShipping?.id === option.id && styles.radioOuterSelected,
          ]}
        >
          {selectedShipping?.id === option.id && (
            <View style={styles.radioInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.optionCard,
        selectedPayment?.id === method.id && styles.selectedOptionCard,
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <View style={styles.optionContent}>
        <View style={styles.paymentMethodInfo}>
          <View style={styles.paymentIconContainer}>
            {method.type === 'wallet' ? (
              <Ionicons name="wallet" size={20} color={theme.COLORS.primary} />
            ) : (
              <Ionicons 
                name={method.type === 'visa' ? 'card-outline' : 'card'} 
                size={20} 
                color={theme.COLORS.primary} 
              />
            )}
          </View>
          
          <View style={styles.paymentDetails}>
            {method.type === 'wallet' ? (
              <>
                <Text style={styles.optionTitle}>NatureBlend Wallet</Text>
                <Text style={styles.walletBalance}>
                  Balance: ${method.balance.toFixed(2)}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.optionTitle}>
                  {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                </Text>
                <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.radioContainer}>
        <View 
          style={[
            styles.radioOuter,
            selectedPayment?.id === method.id && styles.radioOuterSelected,
          ]}
        >
          {selectedPayment?.id === method.id && (
            <View style={styles.radioInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={handleChangeAddress}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressCard}>
            <Ionicons name="location-outline" size={20} color={theme.COLORS.primary} />
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>{deliveryAddress.fullName}</Text>
              <Text style={styles.addressText}>
                {deliveryAddress.street}
              </Text>
              <Text style={styles.addressText}>
                {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>
                {deliveryAddress.country}
              </Text>
              <Text style={styles.phoneNumber}>{deliveryAddress.phone}</Text>
            </View>
          </View>
        </View>
        
        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.changeButtonText}>Edit Cart</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.orderItems}>
            {cartItems.map(renderCartItem)}
          </View>
          
          <View style={styles.couponContainer}>
            <View style={styles.couponInput}>
              <Ionicons name="pricetag-outline" size={20} color={theme.COLORS.gray} />
              <Text style={styles.couponPlaceholder}>
                {appliedCoupon ? appliedCoupon.code : 'Apply Coupon Code'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.couponButton,
                appliedCoupon && styles.couponButtonApplied,
              ]}
              onPress={handleApplyCoupon}
              disabled={appliedCoupon !== null}
            >
              <Text style={[
                styles.couponButtonText,
                appliedCoupon && styles.couponButtonTextApplied,
              ]}>
                {appliedCoupon ? 'Applied' : 'Apply'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Shipping Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Method</Text>
          <View style={styles.shippingOptions}>
            {shippingOptions.map(renderShippingOption)}
          </View>
        </View>
        
        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.changeButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentOptions}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </View>
        
        {/* Order Total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>${shippingCost.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
            
            {appliedCoupon && (
              <View style={styles.totalRow}>
                <Text style={styles.discountLabel}>Discount</Text>
                <Text style={styles.discountValue}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        {/* Empty space at the bottom for button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Place Order Button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? (
            <ActivityIndicator color={theme.COLORS.white} />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Text style={styles.placeOrderAmount}>${totalAmount.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.termsText}>
          By placing an order, you agree to our Terms & Conditions
        </Text>
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
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  placeholderView: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  changeButton: {
    padding: 5,
  },
  changeButtonText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: theme.COLORS.white,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    ...theme.SHADOWS.small,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    marginTop: 4,
  },
  orderItems: {
    marginBottom: 15,
  },
  cartItem: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    ...theme.SHADOWS.small,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 13,
    color: theme.COLORS.gray,
    marginBottom: 6,
  },
  sustainabilityBadge: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  sustainabilityScore: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantity: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  couponContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    ...theme.SHADOWS.small,
  },
  couponInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  couponPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  couponButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  couponButtonApplied: {
    backgroundColor: theme.COLORS.success,
  },
  couponButtonText: {
    color: theme.COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  couponButtonTextApplied: {
    color: theme.COLORS.white,
  },
  shippingOptions: {
    marginTop: 10,
  },
  optionCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.SHADOWS.small,
  },
  selectedOptionCard: {
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionMainInfo: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  ecoTag: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 8,
  },
  ecoText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  deliveryEstimate: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  optionPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  radioContainer: {
    marginLeft: 10,
    padding: 4,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.COLORS.primary,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.primary,
  },
  paymentOptions: {
    marginTop: 10,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 200, 150, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {},
  walletBalance: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  cardExpiry: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  totalCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...theme.SHADOWS.small,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
  },
  discountLabel: {
    fontSize: 14,
    color: theme.COLORS.success,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.lightGray,
    ...theme.SHADOWS.medium,
  },
  placeOrderButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  placeOrderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  termsText: {
    fontSize: 12,
    color: theme.COLORS.gray,
    textAlign: 'center',
  },
});

export default CheckoutScreen;