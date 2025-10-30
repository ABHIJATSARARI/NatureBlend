import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// Import theme
import theme from '../../constants/theme';

// Mock cart data
const initialCartItems = [
  {
    id: '1',
    productId: '101',
    name: 'Organic Ashwagandha Root Powder',
    vendor: 'Mountain Herbs',
    price: 24.99,
    discountPrice: null,
    quantity: 2,
    image: require('../../../assets/images/logo1.png'),
    stock: 145,
    isAvailable: true,
  },
  {
    id: '2',
    productId: '102',
    name: 'Natural Face Serum with Vitamin C',
    vendor: 'Pure Beauty',
    price: 29.99,
    discountPrice: 24.99,
    quantity: 1,
    image: require('../../../assets/images/logo1.png'),
    stock: 38,
    isAvailable: true,
  },
  {
    id: '3',
    productId: '103',
    name: 'Organic Green Tea Collection',
    vendor: 'Tea Haven',
    price: 19.99,
    discountPrice: null,
    quantity: 1,
    image: require('../../../assets/images/logo1.png'),
    stock: 85,
    isAvailable: true,
  },
];

// Mock promo codes
const validPromoCodes = [
  { code: 'WELCOME15', discount: 0.15, type: 'percentage' },
  { code: 'SPRING10', discount: 10, type: 'fixed' },
];

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Load cart data
  useEffect(() => {
    // In a real app, this would fetch cart data from API or local storage
    const timer = setTimeout(() => {
      setCartItems(initialCartItems);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
    
    // Calculate shipping - free if subtotal > $35
    const shipping = subtotal > 35 ? 0 : 4.99;
    
    // Calculate promo discount
    let promoDiscount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        promoDiscount = subtotal * appliedPromo.discount;
      } else {
        promoDiscount = appliedPromo.discount;
      }
    }
    
    // Tax calculation (simplified - usually would depend on location)
    const tax = (subtotal - promoDiscount) * 0.07;
    
    // Calculate grand total
    const total = subtotal - promoDiscount + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      promoDiscount: promoDiscount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const totals = calculateTotals();
  
  // Handle quantity change
  const handleQuantityChange = (itemId, action) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        if (action === 'increase') {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === 'decrease' && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCartItems(updatedCart);
  };
  
  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            const updatedCart = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedCart);
          },
          style: "destructive"
        }
      ]
    );
  };
  
  // Apply promo code
  const handleApplyPromo = () => {
    // Reset previous error
    setPromoError('');
    
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    // Check if promo code is valid
    const foundPromo = validPromoCodes.find(
      promo => promo.code === promoCode.toUpperCase()
    );
    
    if (foundPromo) {
      setAppliedPromo(foundPromo);
      setPromoCode('');
      // Show success message
      Alert.alert(
        "Promo Applied",
        foundPromo.type === 'percentage' 
          ? `${foundPromo.discount * 100}% discount applied to your order!` 
          : `$${foundPromo.discount.toFixed(2)} discount applied to your order!`
      );
    } else {
      setPromoError('Invalid promo code');
    }
  };
  
  // Remove applied promo
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };
  
  // Navigate to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Add items to your cart before checking out.");
      return;
    }
    
    // In a real app, you would pass the cart data and totals to the checkout screen
    navigation.navigate('Checkout', {
      cartItems,
      totals,
      appliedPromo
    });
  };
  
  // Render empty cart
  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color={theme.COLORS.lightGray} />
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartText}>
        Looks like you haven't added any products to your cart yet.
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })}
        style={styles.productImageContainer}
      >
        <Image source={item.image} style={styles.productImage} />
      </TouchableOpacity>
      
      <View style={styles.productDetails}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })}
        >
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>
        
        <Text style={styles.vendorName}>{item.vendor}</Text>
        
        <View style={styles.priceContainer}>
          {item.discountPrice ? (
            <>
              <Text style={styles.discountPrice}>${item.discountPrice}</Text>
              <Text style={styles.originalPrice}>${item.price}</Text>
            </>
          ) : (
            <Text style={styles.price}>${item.price}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[
            styles.quantityButton,
            item.quantity <= 1 && styles.quantityButtonDisabled
          ]}
          onPress={() => handleQuantityChange(item.id, 'decrease')}
          disabled={item.quantity <= 1}
        >
          <Ionicons 
            name="remove" 
            size={16} 
            color={item.quantity <= 1 ? theme.COLORS.lightGray : theme.COLORS.black} 
          />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, 'increase')}
        >
          <Ionicons name="add" size={16} color={theme.COLORS.black} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color={theme.COLORS.error} />
      </TouchableOpacity>
    </View>
  );

  // Render cart list header
  const renderHeader = () => (
    <View style={styles.cartHeader}>
      <Text style={styles.cartTitle}>
        Shopping Cart ({cartItems.reduce((count, item) => count + item.quantity, 0)} items)
      </Text>
    </View>
  );

  // Render cart summary
  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      {/* Promo Code Section */}
      <View style={styles.promoContainer}>
        {appliedPromo ? (
          <View style={styles.appliedPromoContainer}>
            <View style={styles.appliedPromoInfo}>
              <Ionicons name="pricetag" size={16} color={theme.COLORS.success} />
              <Text style={styles.appliedPromoText}>
                {appliedPromo.type === 'percentage' 
                  ? `${appliedPromo.discount * 100}% OFF` 
                  : `$${appliedPromo.discount} OFF`} 
                applied with code {appliedPromo.code}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removePromoButton}
              onPress={handleRemovePromo}
            >
              <Ionicons name="close-circle" size={18} color={theme.COLORS.gray} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyPromo}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {promoError ? <Text style={styles.promoErrorText}>{promoError}</Text> : null}
      </View>
      
      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${totals.subtotal}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>
            {totals.shipping === '0.00' ? 'Free' : `$${totals.shipping}`}
          </Text>
        </View>
        
        {appliedPromo && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Promo Discount</Text>
            <Text style={[styles.summaryValue, styles.discountText]}>
              -${totals.promoDiscount}
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Estimated Tax</Text>
          <Text style={styles.summaryValue}>${totals.tax}</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totals.total}</Text>
        </View>
      </View>
      
      {/* Checkout Button */}
      <TouchableOpacity
        style={[
          styles.checkoutButton,
          cartItems.length === 0 && styles.disabledButton
        ]}
        onPress={handleCheckout}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      
      {/* Continue Shopping */}
      <TouchableOpacity
        style={styles.continueShoppingLink}
        onPress={() => navigation.navigate('Explore')}
      >
        <Ionicons name="arrow-back" size={16} color={theme.COLORS.primary} />
        <Text style={styles.continueShoppingLinkText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderSummary}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.COLORS.gray,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cartHeader: {
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    ...theme.SHADOWS.small,
  },
  productImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.COLORS.black,
    lineHeight: 22,
  },
  vendorName: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.error,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 14,
    color: theme.COLORS.gray,
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.COLORS.ultraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: theme.COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
  summaryContainer: {
    marginTop: 16,
  },
  promoContainer: {
    marginBottom: 16,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: theme.COLORS.white,
  },
  applyButton: {
    height: 48,
    backgroundColor: theme.COLORS.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
  promoErrorText: {
    color: theme.COLORS.error,
    fontSize: 14,
    marginTop: 8,
  },
  appliedPromoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.success + '15',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  appliedPromoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedPromoText: {
    fontSize: 14,
    color: theme.COLORS.success,
    fontWeight: '500',
    marginLeft: 8,
  },
  removePromoButton: {
    padding: 4,
  },
  orderSummary: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    ...theme.SHADOWS.small,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.COLORS.gray,
  },
  summaryValue: {
    fontSize: 16,
    color: theme.COLORS.black,
  },
  discountText: {
    color: theme.COLORS.success,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.ultraLightGray,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: theme.COLORS.primary,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
  disabledButton: {
    backgroundColor: theme.COLORS.lightGray,
  },
  continueShoppingLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  continueShoppingLinkText: {
    fontSize: 16,
    color: theme.COLORS.primary,
    marginLeft: 8,
  },
});

export default CartScreen;