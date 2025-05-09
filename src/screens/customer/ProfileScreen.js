import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

// Dummy user data
const userData = {
  id: 'user123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  profileImage: require('../../../assets/images/splash-icon.png'),
  address: {
    street: '123 Wellness Ave',
    city: 'Greenville',
    state: 'CA',
    zipCode: '90210',
    country: 'United States',
  },
  wallet: {
    balance: 125.50,
    cards: [
      {
        id: 'card1',
        type: 'visa',
        last4: '4242',
        expiry: '05/26',
      },
      {
        id: 'card2',
        type: 'mastercard',
        last4: '8797',
        expiry: '11/25',
      },
    ],
    recentTransactions: [
      {
        id: 'tx1',
        type: 'purchase',
        amount: -59.99,
        date: '2025-05-07',
        description: 'Purchase: Organic Wellness Set',
      },
      {
        id: 'tx2',
        type: 'topup',
        amount: 100.00,
        date: '2025-05-02',
        description: 'Wallet Top-Up',
      },
      {
        id: 'tx3',
        type: 'refund',
        amount: 24.99,
        date: '2025-04-29',
        description: 'Refund: Natural Face Serum',
      },
    ],
  },
  preferences: {
    notifications: true,
    darkMode: false,
    newsletterSubscription: true,
  },
  sustainabilityScore: 87,
  orderCount: 12,
};

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(userData);
  const [activeSection, setActiveSection] = useState('wallet');
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout', 
      'Are you sure you want to log out of your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          }),
        },
      ]
    );
  };
  
  const handleNotificationToggle = () => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        notifications: !prevUser.preferences.notifications,
      },
    }));
  };
  
  const handleDarkModeToggle = () => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        darkMode: !prevUser.preferences.darkMode,
      },
    }));
  };
  
  const handleNewsletterToggle = () => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        newsletterSubscription: !prevUser.preferences.newsletterSubscription,
      },
    }));
  };

  const renderProfileSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.personalInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{user.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.addressContainer}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        
        <View style={styles.addressCard}>
          <Ionicons name="location-outline" size={20} color={theme.COLORS.primary} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressText}>{user.address.street}</Text>
            <Text style={styles.addressText}>{user.address.city}, {user.address.state} {user.address.zipCode}</Text>
            <Text style={styles.addressText}>{user.address.country}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editAddressButton}
          onPress={() => navigation.navigate('EditAddress')}
        >
          <Text style={styles.editAddressText}>Change Address</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.ordersOverview}>
        <Text style={styles.sectionTitle}>Orders Overview</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.orderCount}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          
          <View style={styles.stat}>
            <View style={styles.sustainabilityScoreContainer}>
              <Text style={styles.sustainabilityScore}>{user.sustainabilityScore}</Text>
            </View>
            <Text style={styles.statLabel}>Sustainability Score</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.viewAllText}>View Order History</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWalletSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>NatureBlend Wallet</Text>
          <View style={styles.walletBalance}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>${user.wallet.balance.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.walletActions}>
          <TouchableOpacity 
            style={[styles.walletAction, styles.topUpAction]}
            onPress={() => navigation.navigate('WalletTopUp')}
          >
            <Ionicons name="add-circle-outline" size={18} color={theme.COLORS.white} />
            <Text style={styles.walletActionText}>Top Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.walletAction, styles.withdrawAction]}
            onPress={() => navigation.navigate('WalletWithdraw')}
          >
            <Ionicons name="arrow-down-outline" size={18} color={theme.COLORS.white} />
            <Text style={styles.walletActionText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      
      <View style={styles.paymentMethodsList}>
        {user.wallet.cards.map((card) => (
          <View key={card.id} style={styles.paymentMethodCard}>
            <View style={styles.cardIconContainer}>
              <Ionicons 
                name={card.type === 'visa' ? 'card-outline' : 'card'}
                size={24} 
                color={theme.COLORS.primary} 
              />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardType}>
                {card.type === 'visa' ? 'Visa' : 'Mastercard'} ending in {card.last4}
              </Text>
              <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
            </View>
            <TouchableOpacity style={styles.editCardButton}>
              <Ionicons name="ellipsis-vertical" size={18} color={theme.COLORS.gray} />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addPaymentButton}
          onPress={() => navigation.navigate('AddPaymentMethod')}
        >
          <Ionicons name="add" size={18} color={theme.COLORS.primary} />
          <Text style={styles.addPaymentText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
      <View style={styles.transactionsList}>
        {user.wallet.recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
              <Ionicons 
                name={
                  transaction.type === 'purchase' 
                    ? 'cart-outline' 
                    : transaction.type === 'topup' 
                      ? 'arrow-up-outline' 
                      : 'arrow-back-outline'
                } 
                size={18} 
                color={
                  transaction.type === 'purchase' 
                    ? theme.COLORS.error 
                    : theme.COLORS.success
                } 
              />
            </View>
            
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            
            <Text 
              style={[
                styles.transactionAmount,
                transaction.amount > 0 
                  ? styles.positiveAmount 
                  : styles.negativeAmount
              ]}
            >
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.viewAllTransactionsButton}
          onPress={() => navigation.navigate('Transactions')}
        >
          <Text style={styles.viewAllText}>View All Transactions</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.gray} />
        </TouchableOpacity>
        
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={user.preferences.notifications}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary }}
            thumbColor={theme.COLORS.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={user.preferences.darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary }}
            thumbColor={theme.COLORS.white}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Ionicons name="mail-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Newsletter Subscription</Text>
          <Switch
            value={user.preferences.newsletterSubscription}
            onValueChange={handleNewsletterToggle}
            trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary }}
            thumbColor={theme.COLORS.white}
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Support & Help</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Ionicons name="help-circle-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Help Center</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('ContactUs')}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Contact Us</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Ionicons name="document-text-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => navigation.navigate('TermsConditions')}
        >
          <Ionicons name="list-outline" size={20} color={theme.COLORS.primary} />
          <Text style={styles.settingLabel}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.COLORS.gray} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>NatureBlend v1.0.0</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image source={user.profileImage} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
      </View>
      
      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab, 
            activeSection === 'profile' && styles.activeTab
          ]}
          onPress={() => setActiveSection('profile')}
        >
          <Ionicons 
            name="person" 
            size={20} 
            color={activeSection === 'profile' ? theme.COLORS.primary : theme.COLORS.gray} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeSection === 'profile' && styles.activeTabText
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab, 
            activeSection === 'wallet' && styles.activeTab
          ]}
          onPress={() => setActiveSection('wallet')}
        >
          <Ionicons 
            name="wallet" 
            size={20} 
            color={activeSection === 'wallet' ? theme.COLORS.primary : theme.COLORS.gray} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeSection === 'wallet' && styles.activeTabText
            ]}
          >
            Wallet
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab, 
            activeSection === 'settings' && styles.activeTab
          ]}
          onPress={() => setActiveSection('settings')}
        >
          <Ionicons 
            name="settings" 
            size={20} 
            color={activeSection === 'settings' ? theme.COLORS.primary : theme.COLORS.gray} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeSection === 'settings' && styles.activeTabText
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'profile' && renderProfileSection()}
        {activeSection === 'wallet' && renderWalletSection()}
        {activeSection === 'settings' && renderSettingsSection()}
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
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.COLORS.primary,
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.gray,
  },
  activeTabText: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    padding: 20,
  },
  personalInfo: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 15,
    ...theme.SHADOWS.small,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: theme.COLORS.black,
  },
  editButton: {
    backgroundColor: theme.COLORS.primary + '20', // Primary color with opacity
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: theme.COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 15,
  },
  addressContainer: {
    marginBottom: 5,
  },
  addressCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.SHADOWS.small,
  },
  addressDetails: {
    marginLeft: 12,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  editAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
  },
  editAddressText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    marginRight: 5,
  },
  ordersOverview: {},
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    ...theme.SHADOWS.small,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 5,
  },
  sustainabilityScoreContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  sustainabilityScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    marginRight: 5,
  },
  walletCard: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    ...theme.SHADOWS.medium,
  },
  walletHeader: {
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 14,
    color: theme.COLORS.white,
    opacity: 0.9,
    marginBottom: 5,
  },
  walletBalance: {},
  balanceLabel: {
    fontSize: 12,
    color: theme.COLORS.white,
    opacity: 0.8,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  walletActions: {
    flexDirection: 'row',
  },
  walletAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 10,
  },
  topUpAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  withdrawAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletActionText: {
    color: theme.COLORS.white,
    marginLeft: 5,
    fontWeight: '500',
  },
  paymentMethodsList: {
    marginBottom: 20,
  },
  paymentMethodCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.SHADOWS.small,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.ultraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardType: {
    fontSize: 14,
    color: theme.COLORS.black,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  editCardButton: {
    padding: 5,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.COLORS.primary,
    borderRadius: 10,
  },
  addPaymentText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    marginLeft: 5,
  },
  transactionsList: {
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    ...theme.SHADOWS.small,
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.COLORS.ultraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: theme.COLORS.success,
  },
  negativeAmount: {
    color: theme.COLORS.error,
  },
  viewAllTransactionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  settingsList: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    marginBottom: 20,
    ...theme.SHADOWS.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  settingLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: theme.COLORS.black,
  },
  logoutButton: {
    backgroundColor: theme.COLORS.error,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: theme.COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.COLORS.gray,
  },
});

export default ProfileScreen;