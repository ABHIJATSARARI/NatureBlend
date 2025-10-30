import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';


// Mock data for wallet balance and transactions
const WALLET_DATA = {
  balance: 245.75,
  pending: 0,
  transactions: [
    {
      id: 'tx1',
      type: 'purchase',
      amount: -56.97,
      description: 'Order #NB752396',
      date: '2025-05-08',
      status: 'completed',
    },
    {
      id: 'tx2',
      type: 'topup',
      amount: 100,
      description: 'Wallet top up',
      date: '2025-05-07',
      status: 'completed',
    },
    {
      id: 'tx3',
      type: 'refund',
      amount: 29.99,
      description: 'Refund for Order #NB752267',
      date: '2025-05-06',
      status: 'completed',
    },
    {
      id: 'tx4',
      type: 'purchase',
      amount: -34.99,
      description: 'Order #NB752298',
      date: '2025-05-05',
      status: 'completed',
    },
    {
      id: 'tx5',
      type: 'topup',
      amount: 200,
      description: 'Wallet top up',
      date: '2025-05-04',
      status: 'completed',
    },
    {
      id: 'tx6',
      type: 'purchase',
      amount: -24.99,
      description: 'Order #NB752201',
      date: '2025-05-03',
      status: 'completed',
    },
  ],
  savedCards: [
    {
      id: 'card1',
      type: 'visa',
      number: '•••• •••• •••• 4567',
      expiryDate: '12/26',
      holderName: 'John Doe',
      isDefault: true,
    },
    {
      id: 'card2',
      type: 'mastercard',
      number: '•••• •••• •••• 8901',
      expiryDate: '09/25',
      holderName: 'John Doe',
      isDefault: false,
    },
  ],
};

const WalletScreen = ({ navigation }) => {
  const [walletData, setWalletData] = useState(WALLET_DATA);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return { name: 'cart-outline', color: theme.COLORS.error };
      case 'topup':
        return { name: 'arrow-up-circle-outline', color: theme.COLORS.success };
      case 'refund':
        return { name: 'return-up-back-outline', color: theme.COLORS.info };
      default:
        return { name: 'cash-outline', color: theme.COLORS.gray };
    }
  };

  const getCardIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return { name: 'card-outline', color: '#1A1F71' };
      case 'mastercard':
        return { name: 'card-outline', color: '#EB001B' };
      case 'amex':
        return { name: 'card-outline', color: '#2E77BB' };
      default:
        return { name: 'card-outline', color: theme.COLORS.gray };
    }
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    // In a real app, we would call an API to process the payment
    // For now, we'll just update the local state
    const newTransaction = {
      id: 'tx' + (walletData.transactions.length + 1),
      type: 'topup',
      amount: amount,
      description: 'Wallet top up',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };

    setWalletData({
      ...walletData,
      balance: walletData.balance + amount,
      transactions: [newTransaction, ...walletData.transactions],
    });
    setTopUpAmount('');
    Alert.alert('Success', `$${amount.toFixed(2)} has been added to your wallet.`);
  };

  const handleAddCard = () => {
    navigation.navigate('AddCard');
  };

  const handleEditCard = (cardId) => {
    navigation.navigate('EditCard', { cardId });
  };

  const handleMakeDefaultCard = (cardId) => {
    const updatedCards = walletData.savedCards.map((card) => ({
      ...card,
      isDefault: card.id === cardId,
    }));
    
    setWalletData({
      ...walletData,
      savedCards: updatedCards,
    });
    
    Alert.alert('Default Card Updated', 'Your default payment method has been updated.');
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { transactionId: item.id })}
    >
      <View style={[
        styles.transactionIconContainer,
        { backgroundColor: getTransactionIcon(item.type).color + '20' }
      ]}>
        <Ionicons 
          name={getTransactionIcon(item.type).name} 
          size={20} 
          color={getTransactionIcon(item.type).color}
        />
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          item.amount < 0 ? styles.negativeAmount : styles.positiveAmount
        ]}>
          {item.amount < 0 ? '-' : '+'} ${Math.abs(item.amount).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCardItem = ({ item }) => (
    <View style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTypeContainer}>
          <Ionicons 
            name={getCardIcon(item.type).name} 
            size={24} 
            color={getCardIcon(item.type).color}
          />
          <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
        </View>
        
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.cardNumber}>{item.number}</Text>
      
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.cardLabel}>CARD HOLDER</Text>
          <Text style={styles.cardValue}>{item.holderName}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>EXPIRES</Text>
          <Text style={styles.cardValue}>{item.expiryDate}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        {!item.isDefault && (
          <TouchableOpacity 
            style={styles.cardActionButton}
            onPress={() => handleMakeDefaultCard(item.id)}
          >
            <Text style={styles.cardActionText}>Set As Default</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.cardActionButton, styles.editButton]}
          onPress={() => handleEditCard(item.id)}
        >
          <Text style={[styles.cardActionText, styles.editButtonText]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>
      
      {/* Wallet Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${walletData.balance.toFixed(2)}</Text>
        
        {walletData.pending > 0 && (
          <Text style={styles.pendingAmount}>
            ${walletData.pending.toFixed(2)} pending
          </Text>
        )}
      </View>
      
      {/* Top Up Section */}
      <View style={styles.topUpSection}>
        <Text style={styles.sectionTitle}>Top Up Wallet</Text>
        <View style={styles.topUpContainer}>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0.00"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.topUpButton,
              !topUpAmount ? styles.topUpButtonDisabled : null
            ]}
            disabled={!topUpAmount}
            onPress={handleTopUp}
          >
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' ? styles.activeTab : null]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'transactions' ? styles.activeTabText : null
            ]}
          >
            Transactions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payment' ? styles.activeTab : null]}
          onPress={() => setActiveTab('payment')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'payment' ? styles.activeTabText : null
            ]}
          >
            Payment Methods
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'transactions' ? (
        <FlatList
          data={walletData.transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.transactionsList}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.paymentContainer}>
          {/* Add Card Button */}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={handleAddCard}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.COLORS.primary} />
            <Text style={styles.addCardText}>Add New Payment Method</Text>
          </TouchableOpacity>
          
          {/* Saved Cards */}
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          {walletData.savedCards.map((card) => (
            <View key={card.id} style={styles.cardContainer}>
              {renderCardItem({ item: card })}
            </View>
          ))}
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
  balanceCard: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    margin: 20,
    alignItems: 'center',
    ...theme.SHADOWS.medium,
  },
  balanceLabel: {
    color: theme.COLORS.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 6,
  },
  balanceAmount: {
    color: theme.COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  pendingAmount: {
    color: theme.COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 6,
  },
  topUpSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 10,
  },
  topUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 10,
    ...theme.SHADOWS.small,
  },
  currencySymbol: {
    fontSize: 18,
    color: theme.COLORS.gray,
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: theme.COLORS.black,
  },
  topUpButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topUpButtonDisabled: {
    backgroundColor: theme.COLORS.lightGray,
  },
  topUpButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
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
  transactionsList: {
    padding: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    ...theme.SHADOWS.small,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  negativeAmount: {
    color: theme.COLORS.error,
  },
  positiveAmount: {
    color: theme.COLORS.success,
  },
  paymentContainer: {
    padding: 20,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    ...theme.SHADOWS.small,
  },
  addCardText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
    marginLeft: 10,
  },
  cardContainer: {
    marginBottom: 15,
  },
  cardItem: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 20,
    ...theme.SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardType: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  defaultBadge: {
    backgroundColor: theme.COLORS.primary + '20',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  defaultText: {
    color: theme.COLORS.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 18,
    letterSpacing: 1,
    color: theme.COLORS.black,
    marginBottom: 15,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 10,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: theme.COLORS.black,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.ultraLightGray,
    paddingTop: 15,
  },
  cardActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.COLORS.primary,
    marginLeft: 10,
  },
  cardActionText: {
    color: theme.COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
  },
  editButtonText: {
    color: theme.COLORS.black,
  },
});

export default WalletScreen;