import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';

// Mock transaction data
const TRANSACTIONS = [
  {
    id: 't1',
    type: 'sale',
    amount: 42.99,
    customer: 'Emma Wilson',
    product: 'Herbal Face Serum',
    date: '2025-05-07T14:32:00',
    status: 'completed',
  },
  {
    id: 't2',
    type: 'sale',
    amount: 36.50,
    customer: 'John Martinez',
    product: 'Organic Bath Salts',
    date: '2025-05-06T11:15:00',
    status: 'completed',
  },
  {
    id: 't3',
    type: 'payout',
    amount: 215.84,
    reference: 'NB-PAY-89562',
    date: '2025-05-05T10:00:00',
    status: 'completed',
    account: '**** 4321',
  },
  {
    id: 't4',
    type: 'sale',
    amount: 29.99,
    customer: 'Sarah Johnson',
    product: 'Lavender Essential Oil',
    date: '2025-05-04T16:42:00',
    status: 'completed',
  },
  {
    id: 't5',
    type: 'refund',
    amount: 42.99,
    customer: 'Michael Thompson',
    product: 'Herbal Face Serum',
    date: '2025-05-03T09:22:00',
    status: 'completed',
    reason: 'Customer not satisfied with product',
  },
  {
    id: 't6',
    type: 'sale',
    amount: 56.50,
    customer: 'Lisa Garcia',
    product: 'Wellness Tea Collection',
    date: '2025-05-02T14:10:00',
    status: 'completed',
  },
  {
    id: 't7',
    type: 'payout',
    amount: 186.49,
    reference: 'NB-PAY-89423',
    date: '2025-04-28T10:00:00',
    status: 'completed',
    account: '**** 4321',
  },
  {
    id: 't8',
    type: 'sale',
    amount: 78.95,
    customer: 'Robert Wilson',
    product: 'Natural Skincare Bundle',
    date: '2025-04-26T13:45:00',
    status: 'completed',
  },
];

// Mock wallet data
const WALLET = {
  balance: 328.75,
  pendingBalance: 145.50,
  totalSales: 4825.67,
  payoutSchedule: 'Weekly',
  nextPayoutDate: '2025-05-12T10:00:00',
  nextPayoutAmount: 145.50,
  bankAccount: {
    name: 'Nature Essentials LLC',
    bank: 'EcoBank',
    accountNumber: '**** 4321',
    routingNumber: '**** 5678',
  },
};

const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'sales':
        return TRANSACTIONS.filter(t => t.type === 'sale');
      case 'payouts':
        return TRANSACTIONS.filter(t => t.type === 'payout');
      case 'refunds':
        return TRANSACTIONS.filter(t => t.type === 'refund');
      default:
        return TRANSACTIONS;
    }
  };
  
  const renderTransactionIcon = (type) => {
    switch (type) {
      case 'sale':
        return <Ionicons name="cart-outline" size={22} color={theme.COLORS.success} />;
      case 'payout':
        return <Ionicons name="cash-outline" size={22} color={theme.COLORS.primary} />;
      case 'refund':
        return <Ionicons name="return-down-back-outline" size={22} color={theme.COLORS.error} />;
      default:
        return <Ionicons name="receipt-outline" size={22} color={theme.COLORS.gray} />;
    }
  };
  
  const getTransactionColor = (type) => {
    switch (type) {
      case 'sale':
        return theme.COLORS.success;
      case 'payout':
        return theme.COLORS.primary;
      case 'refund':
        return theme.COLORS.error;
      default:
        return theme.COLORS.gray;
    }
  };
  
  const getTransactionTitle = (transaction) => {
    switch (transaction.type) {
      case 'sale':
        return `Sale - ${transaction.product}`;
      case 'payout':
        return `Payout to Bank Account`;
      case 'refund':
        return `Refund - ${transaction.product}`;
      default:
        return 'Transaction';
    }
  };
  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          {renderTransactionIcon(item.type)}
        </View>
        
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {getTransactionTitle(item)}
          </Text>
          <Text style={styles.transactionSubtitle}>
            {item.type === 'payout' 
              ? `Ref: ${item.reference}` 
              : `Customer: ${item.customer}`}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>
              {formatDate(item.date)} at {formatTime(item.date)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: theme.COLORS.success + '15' }]}>
              <Text style={[styles.statusText, { color: theme.COLORS.success }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.transactionAmount}>
          <Text 
            style={[
              styles.amount, 
              {color: getTransactionColor(item.type)}
            ]}
          >
            {item.type === 'refund' ? '-' : item.type === 'sale' ? '+' : ''}{item.amount.toFixed(2)}
          </Text>
          <Text style={styles.currency}>USD</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sales' && styles.activeTab]} 
          onPress={() => setActiveTab('sales')}
        >
          <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>
            Sales
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'payouts' && styles.activeTab]} 
          onPress={() => setActiveTab('payouts')}
        >
          <Text style={[styles.tabText, activeTab === 'payouts' && styles.activeTabText]}>
            Payouts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'refunds' && styles.activeTab]} 
          onPress={() => setActiveTab('refunds')}
        >
          <Text style={[styles.tabText, activeTab === 'refunds' && styles.activeTabText]}>
            Refunds
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="filter-outline" size={20} color={theme.COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet & Transactions</Text>
      </View>
      
      {/* Wallet Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceSection}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <View style={styles.balanceValueContainer}>
            <Text style={styles.balanceValue}>
              ${WALLET.balance.toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.balanceDetails}>
          <View style={styles.balanceDetailItem}>
            <Text style={styles.balanceDetailLabel}>Pending</Text>
            <Text style={styles.balanceDetailValue}>
              ${WALLET.pendingBalance.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.balanceDetailItem}>
            <Text style={styles.balanceDetailLabel}>Next Payout</Text>
            <Text style={styles.balanceDetailValue}>
              {formatDate(WALLET.nextPayoutDate)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Sales Summary Card */}
      <View style={styles.salesCard}>
        <Text style={styles.salesTitle}>Sales Summary</Text>
        <Text style={styles.salesValue}>${WALLET.totalSales.toFixed(2)}</Text>
        <Text style={styles.salesPeriod}>All Time</Text>
      </View>
      
      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>
        
        {renderTabBar()}
        
        {getFilteredTransactions().length > 0 ? (
          <FlatList
            data={getFilteredTransactions()}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={50} color={theme.COLORS.lightGray} />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  balanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 12,
    shadowColor: theme.COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceSection: {
    marginBottom: 20,
  },
  balanceTitle: {
    fontSize: 14,
    color: theme.COLORS.white + '90',
    marginBottom: 8,
  },
  balanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  withdrawButton: {
    backgroundColor: theme.COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  withdrawButtonText: {
    color: theme.COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  balanceDetails: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white + '20',
    borderRadius: 8,
    padding: 12,
  },
  balanceDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDetailLabel: {
    fontSize: 12,
    color: theme.COLORS.white + '80',
    marginBottom: 4,
  },
  balanceDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
  separator: {
    width: 1,
    backgroundColor: theme.COLORS.white + '30',
    marginHorizontal: 8,
  },
  salesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  salesTitle: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  salesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  salesPeriod: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  exportText: {
    fontSize: 14,
    color: theme.COLORS.primary,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  tabsContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  activeTabText: {
    color: theme.COLORS.primary,
    fontWeight: '600',
  },
  filterButton: {
    padding: 8,
    marginLeft: 'auto',
    marginRight: 16,
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.ultraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 13,
    color: theme.COLORS.darkGray,
    marginBottom: 6,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginRight: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  currency: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginTop: 10,
  },
});

export default WalletScreen;