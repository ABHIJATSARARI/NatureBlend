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
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock order data - in a real app, this would come from an API
const ORDER_DETAILS = {
  id: 'NB123456',
  date: '2025-05-07',
  status: 'Processing',
  statusHistory: [
    { status: 'Order Received', date: '2025-05-07', time: '10:23 AM' },
    { status: 'Payment Confirmed', date: '2025-05-07', time: '10:25 AM' },
    { status: 'Processing', date: '2025-05-07', time: '11:30 AM' },
  ],
  customer: {
    id: 'C001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    avatar: null,
    address: {
      street: '123 Wellness Ave',
      city: 'Greenville',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
    },
  },
  items: [
    {
      id: '1',
      name: 'Organic Wellness Tea',
      quantity: 2,
      price: 18.99,
      sku: 'TEA-001',
      sustainability: 92,
    },
    {
      id: '2',
      name: 'Natural Face Serum',
      quantity: 1,
      price: 34.99,
      sku: 'SKN-032',
      sustainability: 88,
    },
  ],
  shipping: {
    method: 'Standard Shipping',
    cost: 5.99,
    estimated: '3-5 business days',
    estimatedDelivery: '2025-05-14',
    isEco: true,
    tracking: null,
  },
  payment: {
    method: 'Credit Card',
    cardType: 'Visa',
    lastFour: '4242',
    subtotal: 72.97,
    tax: 0,
    discount: 0,
    total: 78.96,
    platformFee: 3.95,
    netProfit: 75.01,
  },
  notes: '',
};

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params || { orderId: 'NB123456' };
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // In a real app, this would fetch data from an API using the orderId
        // For now, we'll simulate loading with a timeout and use mock data
        setTimeout(() => {
          const details = { ...ORDER_DETAILS };
          if (details.notes) {
            setNotes(details.notes);
          }
          setOrderDetails(details);
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

  const handleMarkAsShipped = () => {
    if (!trackingNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter a tracking number before marking as shipped.');
      return;
    }
    
    // In a real app, this would call an API to update the order status
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to mark this order as shipped?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm',
          onPress: () => {
            setOrderDetails(prevDetails => {
              if (!prevDetails) return null;
              
              const updatedStatusHistory = [
                ...prevDetails.statusHistory,
                { status: 'Shipped', date: '2025-05-09', time: '14:30 PM' }
              ];
              
              return {
                ...prevDetails,
                status: 'Shipped',
                statusHistory: updatedStatusHistory,
                shipping: {
                  ...prevDetails.shipping,
                  tracking: trackingNumber
                }
              };
            });
            
            Alert.alert('Success', 'Order has been marked as shipped.');
          }
        }
      ]
    );
  };

  const handleCancelOrder = () => {
    // In a real app, this would call an API to cancel the order
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel Order',
          style: 'destructive',
          onPress: () => {
            setOrderDetails(prevDetails => {
              if (!prevDetails) return null;
              
              const updatedStatusHistory = [
                ...prevDetails.statusHistory,
                { status: 'Cancelled', date: '2025-05-09', time: '14:30 PM' }
              ];
              
              return {
                ...prevDetails,
                status: 'Cancelled',
                statusHistory: updatedStatusHistory
              };
            });
            
            Alert.alert('Order Cancelled', 'The order has been cancelled successfully.');
          }
        }
      ]
    );
  };

  const handleContactCustomer = () => {
    // In a real app, this would navigate to a chat screen or email composer
    if (orderDetails?.customer?.email) {
      Alert.alert('Contact Customer', `Send a message to ${orderDetails.customer.email}`);
    }
  };

  const handleSaveNotes = () => {
    // In a real app, this would call an API to update the order notes
    setOrderDetails(prevDetails => {
      if (!prevDetails) return null;
      return {
        ...prevDetails,
        notes
      };
    });
    setEditingNotes(false);
  };

  const calculateTotalItems = (items) => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
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
                ({calculateTotalItems(orderDetails?.items)} total)
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
            </View>
          </View>
          
          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.customerHeader}>
                <View>
                  <Text style={styles.customerName}>{orderDetails?.customer?.name}</Text>
                  <Text style={styles.customerEmail}>{orderDetails?.customer?.email}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={handleContactCustomer}
                >
                  <Ionicons name="mail-outline" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.addressSection}>
                <Text style={styles.sectionSubtitle}>Shipping Address</Text>
                <Text style={styles.addressText}>{orderDetails?.customer?.name}</Text>
                <Text style={styles.addressText}>{orderDetails?.customer?.address?.street}</Text>
                <Text style={styles.addressText}>
                  {orderDetails?.customer?.address?.city}, {orderDetails?.customer?.address?.state} {orderDetails?.customer?.address?.zipCode}
                </Text>
                <Text style={styles.addressText}>{orderDetails?.customer?.address?.country}</Text>
                <Text style={styles.addressText}>{orderDetails?.customer?.phone}</Text>
              </View>
            </View>
          </View>
          
          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {orderDetails?.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productSku}>SKU: {item.sku}</Text>
                    <View style={styles.sustainabilityBadge}>
                      <Ionicons name="leaf" size={10} color={theme.COLORS.white} />
                      <Text style={styles.sustainabilityText}>{item.sustainability}%</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.productQuantity}>
                  <Text style={styles.quantityText}>×{item.quantity}</Text>
                </View>
                
                <View style={styles.productPrice}>
                  <Text style={styles.priceText}>${(item.price * item.quantity).toFixed(2)}</Text>
                  <Text style={styles.unitPriceText}>(${item.price.toFixed(2)} each)</Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Shipping Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.shippingMethod}>
                <Ionicons name="cube-outline" size={18} color={theme.COLORS.gray} />
                <View style={styles.shippingMethodDetails}>
                  <Text style={styles.shippingMethodName}>{orderDetails?.shipping?.method}</Text>
                  <Text style={styles.shippingEstimate}>{orderDetails?.shipping?.estimated}</Text>
                </View>
                {orderDetails?.shipping?.isEco && (
                  <View style={styles.ecoTag}>
                    <Ionicons name="leaf" size={10} color={theme.COLORS.white} />
                    <Text style={styles.ecoText}>Eco</Text>
                  </View>
                )}
              </View>
              
              {orderDetails?.status === 'Processing' ? (
                <View style={styles.trackingInputContainer}>
                  <Text style={styles.labelText}>Tracking Number</Text>
                  <View style={styles.trackingInputRow}>
                    <TextInput
                      style={styles.trackingInput}
                      placeholder="Enter tracking number"
                      value={trackingNumber}
                      onChangeText={setTrackingNumber}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                      style={styles.shipButton}
                      onPress={handleMarkAsShipped}
                    >
                      <Text style={styles.shipButtonText}>Mark as Shipped</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : orderDetails?.shipping?.tracking ? (
                <View style={styles.trackingInfoContainer}>
                  <Text style={styles.labelText}>Tracking Number</Text>
                  <View style={styles.trackingInfo}>
                    <Text style={styles.trackingNumber}>{orderDetails?.shipping?.tracking}</Text>
                    <TouchableOpacity style={styles.copyButton}>
                      <Ionicons name="copy-outline" size={18} color={theme.COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          
          {/* Payment Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.paymentMethod}>
                <Ionicons 
                  name={orderDetails?.payment?.method === 'Wallet' ? 'wallet-outline' : 'card-outline'} 
                  size={18} 
                  color={theme.COLORS.gray} 
                />
                <Text style={styles.paymentMethodText}>
                  {orderDetails?.payment?.method === 'Credit Card' 
                    ? `${orderDetails?.payment?.cardType} •••• ${orderDetails?.payment?.lastFour}`
                    : orderDetails?.payment?.method
                  }
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.paymentDetails}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Subtotal</Text>
                  <Text style={styles.paymentValue}>${orderDetails?.payment?.subtotal.toFixed(2)}</Text>
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
                
                <View style={styles.paymentDivider} />
                
                <View style={styles.paymentRow}>
                  <Text style={styles.totalLabel}>Customer Total</Text>
                  <Text style={styles.totalValue}>${orderDetails?.payment?.total.toFixed(2)}</Text>
                </View>
                
                <View style={styles.paymentDivider} />
                
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Platform Fee</Text>
                  <Text style={styles.paymentValue}>-${orderDetails?.payment?.platformFee.toFixed(2)}</Text>
                </View>
                
                <View style={styles.paymentRow}>
                  <Text style={styles.profitLabel}>Your Net Profit</Text>
                  <Text style={styles.profitValue}>${orderDetails?.payment?.netProfit.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Notes Section */}
          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionTitle}>Notes</Text>
              {!editingNotes && (
                <TouchableOpacity 
                  style={styles.editNotesButton}
                  onPress={() => setEditingNotes(true)}
                >
                  <Ionicons name="pencil" size={16} color={theme.COLORS.primary} />
                  <Text style={styles.editNotesText}>
                    {notes ? 'Edit' : 'Add Notes'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.notesCard}>
              {editingNotes ? (
                <>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add notes about this order..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.notesActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setEditingNotes(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveNotes}
                    >
                      <Text style={styles.saveButtonText}>Save Notes</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={[styles.notesText, !notes && styles.emptyNotesText]}>
                  {notes || 'No notes added yet.'}
                </Text>
              )}
            </View>
          </View>
          
          {/* Action Buttons */}
          {orderDetails?.status === 'Processing' && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.cancelOrderButton}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelOrderText}>Cancel Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fulfillOrderButton}
                onPress={() => handleMarkAsShipped()}
              >
                <Text style={styles.fulfillOrderText}>Fulfill Order</Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingBottom: 32,
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
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.darkGray,
    marginBottom: 8,
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
  infoCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.ultraLightGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 12,
    color: theme.COLORS.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginVertical: 12,
  },
  addressSection: {
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    marginBottom: 4,
    lineHeight: 20,
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
  productDetails: {
    flex: 2,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productSku: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginRight: 8,
  },
  sustainabilityBadge: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  sustainabilityText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  productQuantity: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.gray,
  },
  productPrice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  unitPriceText: {
    fontSize: 12,
    color: theme.COLORS.gray,
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
    borderRadius: 4,
  },
  ecoText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  trackingInputContainer: {
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 8,
  },
  trackingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingInput: {
    flex: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    color: theme.COLORS.black,
  },
  shipButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  shipButtonText: {
    color: theme.COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  trackingInfoContainer: {
    marginTop: 8,
  },
  trackingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingNumber: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
  },
  copyButton: {
    padding: 6,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentMethodText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginLeft: 8,
    fontWeight: '500',
  },
  paymentDetails: {
    marginTop: 8,
  },
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
  paymentDivider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.COLORS.black,
  },
  profitLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.success,
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.COLORS.success,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  editNotesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNotesText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  notesCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  notesInput: {
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.COLORS.black,
    height: 100,
    marginBottom: 12,
  },
  notesActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: theme.COLORS.gray,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: theme.COLORS.white,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: theme.COLORS.black,
    lineHeight: 20,
  },
  emptyNotesText: {
    fontStyle: 'italic',
    color: theme.COLORS.gray,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  cancelOrderButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelOrderText: {
    fontSize: 14,
    color: theme.COLORS.error,
    fontWeight: '500',
  },
  fulfillOrderButton: {
    flex: 1,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  fulfillOrderText: {
    fontSize: 14,
    color: theme.COLORS.white,
    fontWeight: '500',
  },
});

export default OrderDetailsScreen;