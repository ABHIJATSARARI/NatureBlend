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
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock data for vendor orders
const ORDERS_DATA = [
  {
    id: 'NB123456',
    date: '2025-05-07',
    status: 'Processing',
    customer: {
      id: 'C001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: null,
    },
    items: [
      {
        id: '1',
        name: 'Organic Wellness Tea',
        quantity: 2,
        price: 18.99,
      },
      {
        id: '2',
        name: 'Natural Face Serum',
        quantity: 1,
        price: 34.99,
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      address: '123 Wellness Ave, Greenville, CA 90210',
      cost: 5.99,
      tracking: null,
    },
    payment: {
      method: 'Credit Card',
      subtotal: 72.97,
      tax: 0,
      discount: 0,
      total: 78.96,
    },
  },
  {
    id: 'NB123455',
    date: '2025-05-06',
    status: 'Shipped',
    customer: {
      id: 'C002',
      name: 'Sarah Miller',
      email: 'sarah@example.com',
      avatar: null,
    },
    items: [
      {
        id: '3',
        name: 'Herbal Supplement',
        quantity: 1,
        price: 29.99,
      },
    ],
    shipping: {
      method: 'Express Shipping',
      address: '456 Nature St, Riverside, CA 92501',
      cost: 9.99,
      tracking: 'TRK7890123456',
    },
    payment: {
      method: 'Wallet',
      subtotal: 29.99,
      tax: 0,
      discount: 0,
      total: 39.98,
    },
  },
  {
    id: 'NB123454',
    date: '2025-05-04',
    status: 'Delivered',
    customer: {
      id: 'C003',
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: null,
    },
    items: [
      {
        id: '5',
        name: 'Organic Skincare Set',
        quantity: 1,
        price: 89.99,
      },
    ],
    shipping: {
      method: 'Eco-Friendly Shipping',
      address: '789 Green Blvd, Oakland, CA 94612',
      cost: 7.50,
      tracking: 'TRK7890123457',
    },
    payment: {
      method: 'Credit Card',
      subtotal: 89.99,
      tax: 0,
      discount: 10.00,
      total: 87.49,
    },
  },
  {
    id: 'NB123453',
    date: '2025-05-02',
    status: 'Cancelled',
    customer: {
      id: 'C004',
      name: 'Emily Wilson',
      email: 'emily@example.com',
      avatar: null,
    },
    items: [
      {
        id: '4',
        name: 'Essential Oil Blend',
        quantity: 3,
        price: 12.99,
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      address: '101 Harmony Dr, San Francisco, CA 94107',
      cost: 5.99,
      tracking: null,
    },
    payment: {
      method: 'Wallet',
      subtotal: 38.97,
      tax: 0,
      discount: 0,
      total: 44.96,
    },
  },
  {
    id: 'NB123452',
    date: '2025-05-01',
    status: 'Delivered',
    customer: {
      id: 'C005',
      name: 'David Garcia',
      email: 'david@example.com',
      avatar: null,
    },
    items: [
      {
        id: '6',
        name: 'Reusable Bamboo Straw Set',
        quantity: 2,
        price: 14.99,
      },
      {
        id: '1',
        name: 'Organic Wellness Tea',
        quantity: 1,
        price: 18.99,
      },
    ],
    shipping: {
      method: 'Express Shipping',
      address: '202 Eco Lane, Los Angeles, CA 90001',
      cost: 9.99,
      tracking: 'TRK7890123458',
    },
    payment: {
      method: 'Credit Card',
      subtotal: 48.97,
      tax: 0,
      discount: 5.00,
      total: 53.96,
    },
  },
  {
    id: 'NB123451',
    date: '2025-04-28',
    status: 'Delivered',
    customer: {
      id: 'C006',
      name: 'Jennifer Lopez',
      email: 'jennifer@example.com',
      avatar: null,
    },
    items: [
      {
        id: '7',
        name: 'Meditation Cushion',
        quantity: 1,
        price: 45.99,
      },
    ],
    shipping: {
      method: 'Standard Shipping',
      address: '303 Zen Path, San Diego, CA 92101',
      cost: 5.99,
      tracking: 'TRK7890123459',
    },
    payment: {
      method: 'Wallet',
      subtotal: 45.99,
      tax: 0,
      discount: 0,
      total: 51.98,
    },
  },
];

const OrderManagementScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('date_desc'); // Default sorting

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

  useEffect(() => {
    // Apply filters and search
    let result = [...orders];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'All') {
      result = result.filter(order => order.status === activeFilter);
    }
    
    // Apply sorting
    result = sortOrders(result, sortOrder);
    
    setFilteredOrders(result);
  }, [searchQuery, activeFilter, orders, sortOrder]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const sortOrders = (ordersToSort, sortType) => {
    const sorted = [...ordersToSort];
    
    switch (sortType) {
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'total_asc':
        return sorted.sort((a, b) => a.payment.total - b.payment.total);
      case 'total_desc':
        return sorted.sort((a, b) => b.payment.total - a.payment.total);
      default:
        return sorted;
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

  const calculateTotalItems = (items) => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{item.id}</Text>
          <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(item.status) + '20' }
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
          <Text style={styles.infoValue}>${item.payment.total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {item.payment.method.length > 8 ? 'Wallet' : item.payment.method}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
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
  customerSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 14,
    color: theme.COLORS.black,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryAction: {
    backgroundColor: theme.COLORS.primary,
  },
  secondaryAction: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.info,
  },
  viewAction: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.white,
  },
  secondaryActionText: {
    color: theme.COLORS.info,
  },
  viewActionText: {
    color: theme.COLORS.primary,
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
});

export default OrderManagementScreen;