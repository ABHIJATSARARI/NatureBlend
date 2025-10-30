import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock order data - in a real app, this would come from an API
const ORDER_DETAILS = {
  id: 'NB123456',
  date: '2025-05-07',
  status: 'Processing',
  statusHistory: [
    { status: 'Order Placed', date: '2025-05-07', time: '10:23 AM' },
    { status: 'Payment Confirmed', date: '2025-05-07', time: '10:25 AM' },
    { status: 'Processing', date: '2025-05-07', time: '11:30 AM' },
  ],
  items: [
    {
      id: '1',
      name: 'Organic Wellness Tea',
      image: require('../../../assets/images/logo1.png'),
      quantity: 2,
      price: 18.99,
      vendor: 'Herbal Essentials',
      sustainabilityScore: 92,
    },
    {
      id: '2',
      name: 'Natural Face Serum',
      image: require('../../../assets/images/logo1.png'),
      quantity: 1,
      price: 34.99,
      vendor: 'Pure Botanics',
      sustainabilityScore: 88,
    },
  ],
  subtotal: 72.97,
  shipping: {
    method: 'Standard Shipping',
    cost: 5.99,
    estimated: '3-5 business days',
    estimatedDelivery: '2025-05-14',
    address: {
      name: 'Alex Johnson',
      street: '123 Wellness Ave',
      city: 'Greenville, CA 90210',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    isEco: true,
    tracking: {
      number: 'TRK7890123456',
      url: 'https://track.carrier.com/TRK7890123456',
    },
  },
  payment: {
    method: 'Credit Card',
    cardType: 'Visa',
    lastFour: '4242',
    discount: 0,
    tax: 0,
    total: 78.96,
  }
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params || { orderId: 'NB123456' };
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // In a real app, this would fetch data from an API using the orderId
        // For now, we'll simulate loading with a timeout and use mock data
        setTimeout(() => {
          setOrderDetails(ORDER_DETAILS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return theme.COLORS.warning;
      case 'Shipped':
        return theme.COLORS.info;
      case 'Delivered':
        return theme.COLORS.success;
      case 'Cancelled':
        return theme.COLORS.error;
      default:
        return theme.COLORS.primary;
    }
  };

  const handleContactSupport = () => {
    // In a real app, this would navigate to a support screen or open a chat
    alert('Support feature would open here');
  };

  const handleTrackPackage = () => {
    // In a real app, this would navigate to a tracking page or open a web view
    if (orderDetails?.shipping?.tracking?.url) {
      alert('Tracking page would open here');
      // navigation.navigate('TrackingWebView', { url: orderDetails.shipping.tracking.url });
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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary Card */}
          <View style={styles.orderSummaryCard}>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>Order #{orderDetails?.id}</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(orderDetails?.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { color: getStatusColor(orderDetails?.status) }
                ]}>
                  {orderDetails?.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderMetaRow}>
              <Text style={styles.orderMeta}>
                Placed on {new Date(orderDetails?.date).toLocaleDateString()}
              </Text>
              <Text style={styles.orderMeta}>
                {orderDetails?.items.length} {orderDetails?.items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>
          
          {/* Order Status Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.timeline}>
              {orderDetails?.statusHistory.map((status, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineBulletContainer}>
                    <View style={[
                      styles.timelineBullet,
                      { backgroundColor: index === 0 ? theme.COLORS.primary : theme.COLORS.lightGray }
                    ]} />
                    {index < orderDetails.statusHistory.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStatus}>{status.status}</Text>
                    <Text style={styles.timelineDate}>
                      {status.date} at {status.time}
                    </Text>
                  </View>
                </View>
              ))}
              
              {orderDetails?.status !== 'Delivered' && (
                <View style={styles.estimatedDelivery}>
                  <Ionicons name="time-outline" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.estimatedDeliveryText}>
                    Estimated delivery: {new Date(orderDetails?.shipping?.estimatedDelivery).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {orderDetails?.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.vendorName}>{item.vendor}</Text>
                  
                  <View style={styles.productMeta}>
                    <View style={styles.sustainabilityBadge}>
                      <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
                      <Text style={styles.sustainabilityText}>{item.sustainabilityScore}%</Text>
                    </View>
                    <Text style={styles.quantity}>Qty: {item.quantity}</Text>
                  </View>
                </View>
                <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          
          {/* Shipping Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.shippingCard}>
              <View style={styles.shippingMethod}>
                <Ionicons name="cube-outline" size={20} color={theme.COLORS.gray} />
                <View style={styles.shippingMethodDetails}>
                  <Text style={styles.shippingMethodName}>{orderDetails?.shipping?.method}</Text>
                  <Text style={styles.shippingEstimate}>{orderDetails?.shipping?.estimated}</Text>
                </View>
                {orderDetails?.shipping?.isEco && (
                  <View style={styles.ecoTag}>
                    <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
                    <Text style={styles.ecoText}>Eco</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>Delivery Address:</Text>
                <Text style={styles.addressName}>{orderDetails?.shipping?.address?.name}</Text>
                <Text style={styles.addressText}>{orderDetails?.shipping?.address?.street}</Text>
                <Text style={styles.addressText}>{orderDetails?.shipping?.address?.city}</Text>
                <Text style={styles.addressText}>{orderDetails?.shipping?.address?.country}</Text>
                <Text style={styles.addressPhone}>{orderDetails?.shipping?.address?.phone}</Text>
              </View>
              
              {orderDetails?.shipping?.tracking && orderDetails?.status !== 'Processing' && (
                <TouchableOpacity 
                  style={styles.trackingButton}
                  onPress={handleTrackPackage}
                >
                  <Ionicons name="location-outline" size={16} color={theme.COLORS.white} />
                  <Text style={styles.trackingButtonText}>Track Package</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Payment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.paymentCard}>
              <View style={styles.paymentMethod}>
                <Ionicons 
                  name={orderDetails?.payment?.method === 'Wallet' ? 'wallet-outline' : 'card-outline'} 
                  size={20} 
                  color={theme.COLORS.gray} 
                />
                <Text style={styles.paymentMethodText}>
                  {orderDetails?.payment?.method === 'Credit Card' 
                    ? `${orderDetails?.payment?.cardType} •••• ${orderDetails?.payment?.lastFour}`
                    : orderDetails?.payment?.method
                  }
                </Text>
              </View>
              
              <View style={styles.paymentDetails}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Subtotal</Text>
                  <Text style={styles.paymentValue}>${orderDetails?.subtotal.toFixed(2)}</Text>
                </View>
                
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Shipping</Text>
                  <Text style={styles.paymentValue}>${orderDetails?.shipping?.cost.toFixed(2)}</Text>
                </View>
                
                {orderDetails?.payment?.discount > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Discount</Text>
                    <Text style={[styles.paymentValue, styles.discountValue]}>
                      -${orderDetails?.payment?.discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                
                {orderDetails?.payment?.tax > 0 && (
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Tax</Text>
                    <Text style={styles.paymentValue}>${orderDetails?.payment?.tax.toFixed(2)}</Text>
                  </View>
                )}
                
                <View style={styles.separator} />
                
                <View style={styles.paymentRowTotal}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${orderDetails?.payment?.total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Support */}
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.COLORS.primary} />
            <Text style={styles.supportButtonText}>Contact Support About This Order</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.COLORS.gray,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  orderSummaryCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderMeta: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 12,
  },
  timeline: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineBulletContainer: {
    alignItems: 'center',
    marginRight: 12,
    height: 40,
  },
  timelineBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  estimatedDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -10,
  },
  estimatedDeliveryText: {
    fontSize: 13,
    color: theme.COLORS.primary,
    marginLeft: 6,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  productDetails: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  vendorName: {
    fontSize: 12,
    color: theme.COLORS.primary,
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sustainabilityBadge: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  sustainabilityText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  quantity: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  shippingCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  shippingMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shippingMethodDetails: {
    flex: 1,
    marginLeft: 12,
  },
  shippingMethodName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  shippingEstimate: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  ecoTag: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  ecoText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  addressContainer: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 13,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    marginTop: 2,
  },
  trackingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
  },
  trackingButtonText: {
    color: theme.COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  paymentCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentMethodText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginLeft: 12,
  },
  paymentDetails: {},
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  paymentValue: {
    fontSize: 14,
    color: theme.COLORS.black,
  },
  discountValue: {
    color: theme.COLORS.success,
  },
  separator: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginVertical: 8,
  },
  paymentRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  supportButtonText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    marginLeft: 6,
  },
});

export default OrderDetailsScreen;