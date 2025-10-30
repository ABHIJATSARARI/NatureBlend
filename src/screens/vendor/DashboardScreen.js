import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';


const { width } = Dimensions.get('window');

// Dummy data for prototype
const salesData = {
  daily: [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 180 },
    { day: 'Wed', amount: 240 },
    { day: 'Thu', amount: 190 },
    { day: 'Fri', amount: 280 },
    { day: 'Sat', amount: 250 },
    { day: 'Sun', amount: 170 },
  ],
  totalSales: 1430,
  totalOrders: 32,
  pendingOrders: 5,
};

const stockAlerts = [
  {
    id: '1',
    name: 'Organic Ashwagandha',
    currentStock: 5,
    threshold: 10,
  },
  {
    id: '2',
    name: 'Natural Face Serum',
    currentStock: 2,
    threshold: 8,
  },
];

const recentOrders = [
  {
    id: 'NB752396',
    date: '2025-05-08',
    customer: 'John D.',
    amount: 74.97,
    status: 'Processing',
  },
  {
    id: 'NB752341',
    date: '2025-05-07',
    customer: 'Sarah M.',
    amount: 149.95,
    status: 'Shipped',
  },
  {
    id: 'NB752298',
    date: '2025-05-06',
    customer: 'Emily K.',
    amount: 34.99,
    status: 'Delivered',
  },
];

const reviews = [
  {
    id: '1',
    product: 'Organic Ashwagandha',
    rating: 4,
    comment: 'Works great for reducing my stress levels! Will buy again.',
    customer: 'Alex T.',
    date: '2025-05-07',
  },
  {
    id: '2',
    product: 'Herbal Tea Collection',
    rating: 5,
    comment: 'Fantastic selection of teas. Love them all!',
    customer: 'Jennifer R.',
    date: '2025-05-05',
  },
];

const DashboardScreen = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState('week');
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return theme.COLORS.info;
      case 'Shipped':
        return theme.COLORS.warning;
      case 'Delivered':
        return theme.COLORS.success;
      default:
        return theme.COLORS.gray;
    }
  };
  
  // Find the highest sales value for chart scaling
  const maxSalesValue = Math.max(...salesData.daily.map(day => day.amount));
  
  const renderSalesBarChart = () => (
    <View style={styles.chartContainer}>
      {salesData.daily.map((day, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={styles.barWrapper}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (day.amount / maxSalesValue) * 130,
                  backgroundColor: theme.COLORS.primary,
                }
              ]} 
            />
          </View>
          <Text style={styles.barLabel}>{day.day}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Dashboard</Text>
          <Text style={styles.storeName}>Mountain Herbs</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.COLORS.black} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('ProfileMain')}
          >
            <Ionicons name="person-circle-outline" size={28} color={theme.COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sales Overview Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sales Overview</Text>
            <View style={styles.timeframeSelector}>
              <TouchableOpacity 
                style={[
                  styles.timeframeOption,
                  timeframe === 'week' && styles.activeTimeframe
                ]}
                onPress={() => setTimeframe('week')}
              >
                <Text style={[
                  styles.timeframeText,
                  timeframe === 'week' && styles.activeTimeframeText
                ]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.timeframeOption,
                  timeframe === 'month' && styles.activeTimeframe
                ]}
                onPress={() => setTimeframe('month')}
              >
                <Text style={[
                  styles.timeframeText,
                  timeframe === 'month' && styles.activeTimeframeText
                ]}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.timeframeOption,
                  timeframe === 'year' && styles.activeTimeframe
                ]}
                onPress={() => setTimeframe('year')}
              >
                <Text style={[
                  styles.timeframeText,
                  timeframe === 'year' && styles.activeTimeframeText
                ]}>Year</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Ionicons name="cash-outline" size={24} color={theme.COLORS.primary} />
              <Text style={styles.metricValue}>${salesData.totalSales}</Text>
              <Text style={styles.metricLabel}>Total Sales</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="cart-outline" size={24} color={theme.COLORS.secondary} />
              <Text style={styles.metricValue}>{salesData.totalOrders}</Text>
              <Text style={styles.metricLabel}>Orders</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="time-outline" size={24} color={theme.COLORS.warning} />
              <Text style={styles.metricValue}>{salesData.pendingOrders}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
            </View>
          </View>
          
          {/* Sales Chart */}
          {renderSalesBarChart()}
          
          <TouchableOpacity 
            style={styles.viewAnalyticsButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Text style={styles.viewAnalyticsButtonText}>View Detailed Analytics</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(58, 158, 96, 0.1)' }]}>
              <Ionicons name="add-circle-outline" size={24} color={theme.COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('OrdersMain')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 125, 77, 0.1)' }]}>
              <Ionicons name="list-outline" size={24} color={theme.COLORS.accent} />
            </View>
            <Text style={styles.actionText}>Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(73, 165, 120, 0.1)' }]}>
              <Ionicons name="wallet-outline" size={24} color={theme.COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProductsMain')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
              <Ionicons name="cube-outline" size={24} color={theme.COLORS.info} />
            </View>
            <Text style={styles.actionText}>Inventory</Text>
          </TouchableOpacity>
        </View>
        
        {/* Stock Alerts */}
        {stockAlerts.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Stock Alerts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProductsMain')}>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.alertsContainer}>
              {stockAlerts.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.alertItem}
                  onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
                >
                  <View style={styles.alertIconContainer}>
                    <Ionicons name="warning-outline" size={22} color={theme.COLORS.warning} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{item.name}</Text>
                    <Text style={styles.alertMessage}>
                      Low stock: {item.currentStock} items left (Threshold: {item.threshold})
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Recent Orders */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OrdersMain')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ordersContainer}>
            {recentOrders.map((order) => (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderItem}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <View style={[
                    styles.orderStatus,
                    { backgroundColor: getStatusColor(order.status) + '20' } // Add 20% opacity
                  ]}>
                    <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.orderDetails}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderCustomer}>{order.customer}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Recent Reviews */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewsContainer}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewProduct}>{review.product}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star}
                        name={star <= review.rating ? 'star' : 'star-outline'} 
                        size={16} 
                        color="#FFD700" 
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
                
                <Text style={styles.reviewComment}>"{review.comment}"</Text>
                
                <View style={styles.reviewFooter}>
                  <Text style={styles.reviewCustomer}>{review.customer}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  welcomeText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    position: 'relative',
    marginLeft: 15,
    padding: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.COLORS.error,
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.white,
  },
  badgeText: {
    color: theme.COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    ...theme.SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  sectionAction: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    padding: 3,
  },
  timeframeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTimeframe: {
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.small,
  },
  timeframeText: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  activeTimeframeText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    marginHorizontal: 5,
    ...theme.SHADOWS.small,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
    marginBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 130,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  viewAnalyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  viewAnalyticsButtonText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
    marginRight: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 32 - 30) / 4, // Subtracting margins and spacing between buttons
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: theme.COLORS.black,
    textAlign: 'center',
  },
  alertsContainer: {
    marginBottom: 10,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.COLORS.warning + '20', // Add 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  ordersContainer: {
    marginBottom: 10,
  },
  orderItem: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  reviewsContainer: {
    marginBottom: 10,
  },
  reviewItem: {
    padding: 12,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewProduct: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: theme.COLORS.black,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewCustomer: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
});

export default DashboardScreen;