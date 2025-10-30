import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock data for customer orders
const ORDERS_DATA = [
  {
    id: 'NB123456',
    date: '2025-05-07',
    status: 'Processing',
    totalAmount: 78.95,
    items: [
      {
        id: '1',
        name: 'Organic Wellness Tea',
        image: require('../../../assets/images/logo1.png'),
        quantity: 2,
        price: 18.99,
      },
      {
        id: '2',
        name: 'Natural Face Serum',
        image: require('../../../assets/images/logo1.png'),
        quantity: 1,
        price: 34.99,
      },
    ],
    shippingMethod: 'Standard Shipping',
    estimatedDelivery: '2025-05-14',
  },
  {
    id: 'NB123455',
    date: '2025-04-23',
    status: 'Delivered',
    totalAmount: 56.45,
    items: [
      {
        id: '3',
        name: 'Herbal Supplement',
        image: require('../../../assets/images/logo1.png'),
        quantity: 1,
        price: 29.99,
      },
      {
        id: '4',
        name: 'Essential Oil Blend',
        image: require('../../../assets/images/logo1.png'),
        quantity: 2,
        price: 12.99,
      },
    ],
    shippingMethod: 'Express Shipping',
    estimatedDelivery: '2025-04-25',
    deliveredOn: '2025-04-25',
  },
  {
    id: 'NB123454',
    date: '2025-04-12',
    status: 'Delivered',
    totalAmount: 104.85,
    items: [
      {
        id: '5',
        name: 'Organic Skincare Set',
        image: require('../../../assets/images/logo1.png'),
        quantity: 1,
        price: 89.99,
      },
      {
        id: '6',
        name: 'Reusable Bamboo Straw Set',
        image: require('../../../assets/images/logo1.png'),
        quantity: 1,
        price: 14.99,
      },
    ],
    shippingMethod: 'Eco-Friendly Shipping',
    estimatedDelivery: '2025-04-19',
    deliveredOn: '2025-04-18',
  },
];

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the mock data and a timeout to simulate loading
        setTimeout(() => {
          setOrders(ORDERS_DATA);
          setFilteredOrders(ORDERS_DATA);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = orders.filter(
        (order) => order.id.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      handleFilterChange(activeFilter); // Reapply current filter
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'All') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === filter);
      setFilteredOrders(filtered);
    }
  };
  
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
        return theme.COLORS.gray;
    }
  };
  
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>Placed on {new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.productsPreview}>
        {item.items.slice(0, 2).map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
            </View>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>+{item.items.length - 2} more items</Text>
        )}
      </View>
      
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.deliveryLabel}>
            {item.status === 'Delivered' ? 'Delivered on:' : 'Estimated delivery:'}
          </Text>
          <Text style={styles.deliveryDate}>
            {item.status === 'Delivered' 
              ? new Date(item.deliveredOn).toLocaleDateString() 
              : new Date(item.estimatedDelivery).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order ID..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab,
            ]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === filter && styles.activeFilterTabText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color={theme.COLORS.lightGray} />
          <Text style={styles.emptyTitle}>No Orders Found</Text>
          <Text style={styles.emptyMessage}>
            {searchQuery
              ? `No results match "${searchQuery}"`
              : `You don't have any ${activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders yet`}
          </Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.COLORS.ultraLightGray,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  activeFilterTab: {
    backgroundColor: theme.COLORS.primary + '20', // 20% opacity
  },
  filterTabText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  activeFilterTabText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
    paddingTop: 4,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: theme.COLORS.gray,
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
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginBottom: 12,
  },
  productsPreview: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 13,
    color: theme.COLORS.gray,
  },
  moreItems: {
    fontSize: 13,
    color: theme.COLORS.primary,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deliveryLabel: {
    fontSize: 13,
    color: theme.COLORS.gray,
    marginBottom: 2,
  },
  deliveryDate: {
    fontSize: 14,
    color: theme.COLORS.black,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: theme.COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopNowButton: {
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrdersScreen;