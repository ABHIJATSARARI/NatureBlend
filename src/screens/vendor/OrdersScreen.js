import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

// Dummy data for orders
const ORDERS_DATA = [
  {
    id: 'NB752396',
    date: '2025-05-08',
    customer: {
      name: 'John Doe',
      address: '123 Main St, Anytown, CA 90210',
      phone: '(555) 123-4567',
      email: 'john.doe@example.com',
    },
    items: [
      {
        id: '1',
        name: 'Organic Ashwagandha',
        quantity: 2,
        price: 24.99,
      },
      {
        id: '2',
        name: 'Natural Face Serum',
        quantity: 1,
        price: 29.99,
      },
    ],
    total: 74.97,
    status: 'Processing',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    notes: '',
  },
  {
    id: 'NB752341',
    date: '2025-05-07',
    customer: {
      name: 'Sarah Miller',
      address: '456 Oak Ave, Somewhere, NY 10001',
      phone: '(555) 987-6543',
      email: 'sarah.m@example.com',
    },
    items: [
      {
        id: '3',
        name: 'Eco-Friendly Yoga Mat',
        quantity: 1,
        price: 49.99,
      },
      {
        id: '4',
        name: 'Herbal Tea Collection',
        quantity: 2,
        price: 19.99,
      },
      {
        id: '5',
        name: 'Meditation Cushion',
        quantity: 1,
        price: 39.99,
      },
    ],
    total: 149.95,
    status: 'Shipped',
    paymentMethod: 'PayPal',
    shippingMethod: 'Express Shipping',
    notes: 'Please leave at front door',
  },
  {
    id: 'NB752298',
    date: '2025-05-06',
    customer: {
      name: 'Emily Kim',
      address: '789 Pine Ln, Elsewhere, TX 75001',
      phone: '(555) 234-5678',
      email: 'emily.k@example.com',
    },
    items: [
      {
        id: '6',
        name: 'Essential Oil Diffuser',
        quantity: 1,
        price: 34.99,
      },
    ],
    total: 34.99,
    status: 'Delivered',
    paymentMethod: 'NatureBlend Wallet',
    shippingMethod: 'Standard Shipping',
    notes: '',
  },
  {
    id: 'NB752267',
    date: '2025-05-05',
    customer: {
      name: 'Michael Johnson',
      address: '101 Maple Dr, Nowhere, WA 98001',
      phone: '(555) 876-5432',
      email: 'michael.j@example.com',
    },
    items: [
      {
        id: '7',
        name: 'Wellness Journal',
        quantity: 1,
        price: 15.99,
      },
      {
        id: '8',
        name: 'Organic Lavender Honey',
        quantity: 2,
        price: 12.50,
      },
    ],
    total: 40.99,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    notes: 'Gift order - please include gift receipt',
  },
  {
    id: 'NB752201',
    date: '2025-05-04',
    customer: {
      name: 'Jessica Taylor',
      address: '202 Birch St, Anywhere, FL 33101',
      phone: '(555) 345-6789',
      email: 'jessica.t@example.com',
    },
    items: [
      {
        id: '9',
        name: 'Natural Sleep Aid',
        quantity: 1,
        price: 19.99,
      },
      {
        id: '10',
        name: 'Sustainably Harvested Spirulina',
        quantity: 2,
        price: 22.50,
      },
    ],
    total: 64.99,
    status: 'Cancelled',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Express Shipping',
    notes: 'Customer requested cancellation',
  },
];

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Simulating API fetch with delay
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, you'd fetch data from API
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
        (order) =>
          order.id.toLowerCase().includes(text.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(text.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(text.toLowerCase())
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
        return theme.COLORS.info;
      case 'Shipped':
        return theme.COLORS.warning;
      case 'Delivered':
        return theme.COLORS.success;
      case 'Cancelled':
        return theme.COLORS.error;
      default:
        return theme.COLORS.gray;
    }
  };

  const calculateTotalItems = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>#{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) + '20' } // Add opacity
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.customerSection}>
        <Text style={styles.sectionLabel}>Customer:</Text>
        <Text style={styles.customerName}>{item.customer.name}</Text>
      </View>
      
      <View style={styles.orderInfoRow}>
        <View style={styles.orderInfoItem}>
          <Text style={styles.infoLabel}>Items</Text>
          <Text style={styles.infoValue}>{calculateTotalItems(item.items)}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.infoValue}>${item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.paymentMethod.length > 8 ? 'Wallet' : item.paymentMethod}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderActions}>
        {item.status === 'Processing' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => navigation.navigate('OrderFulfill', { orderId: item.id })}
          >
            <Text style={styles.actionButtonText}>Fulfill</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'Shipped' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => navigation.navigate('OrderTrack', { orderId: item.id })}
          >
            <Text style={[styles.actionButtonText, styles.secondaryActionText]}>Track</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.viewAction]}
          onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
        >
          <Text style={[styles.actionButtonText, styles.viewActionText]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order ID, customer name..."
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
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color={theme.COLORS.lightGray} />
          <Text style={styles.emptyTitle}>No Orders Found</Text>
          <Text style={styles.emptyMessage}>
            {searchQuery
              ? `No results match "${searchQuery}"`
              : `You don't have any ${activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders yet`}
          </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    backgroundColor: theme.COLORS.white,
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
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    ...theme.SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  activeFilterTab: {
    backgroundColor: theme.COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  activeFilterTabText: {
    color: theme.COLORS.white,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: theme.COLORS.gray,
    textAlign: 'center',
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.SHADOWS.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdContainer: {
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
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
    marginVertical: 12,
  },
  customerSection: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.COLORS.black,
  },
  orderInfoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  orderInfoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  primaryAction: {
    backgroundColor: theme.COLORS.primary,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.warning,
  },
  viewAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.white,
  },
  secondaryActionText: {
    color: theme.COLORS.warning,
  },
  viewActionText: {
    color: theme.COLORS.black,
  },
});

export default OrdersScreen;