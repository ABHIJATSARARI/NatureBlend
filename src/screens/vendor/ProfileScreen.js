import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock vendor profile data
const VENDOR_PROFILE = {
  id: 'V001',
  name: 'Nature Essentials Co.',
  email: 'contact@natureessentials.com',
  phone: '+1 (555) 987-6543',
  avatar: null,
  coverImage: null,
  bio: 'We create sustainable, eco-friendly wellness products using ethically sourced ingredients. Our mission is to blend nature with modern science to create effective, pure products.',
  address: {
    street: '789 Wellness Avenue',
    city: 'Portland',
    state: 'OR',
    zipCode: '97205',
    country: 'United States',
  },
  business: {
    type: 'LLC',
    foundedYear: 2020,
    employeeCount: '1-10',
    taxId: 'XX-XXXXXXX',
    website: 'www.natureessentials.com',
    socialMedia: {
      instagram: '@natureessentials',
      facebook: 'NatureEssentialsOfficial',
      tiktok: '@naturewellness',
    },
  },
  banking: {
    accountName: 'Nature Essentials LLC',
    bankName: 'EcoBank',
    accountNumber: '****4321',
    routingNumber: '****5678',
  },
  notifications: {
    newOrders: true,
    orderUpdates: true,
    marketing: false,
    analytics: true,
  },
  sustainabilityScore: 92,
  storeBadges: ['Eco-Friendly', 'Organic Certified', 'Cruelty-Free'],
  verificationStatus: 'Verified',
  memberSince: '2023-07-15',
  lastLogin: '2025-05-08',
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll simulate loading with a timeout and use mock data
    const fetchProfile = async () => {
      try {
        setTimeout(() => {
          setProfile(VENDOR_PROFILE);
          setEditedProfile(VENDOR_PROFILE);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes if canceling edit mode
      setEditedProfile(profile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the profile
    Alert.alert(
      'Update Profile',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            setProfile(editedProfile);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
          },
        },
      ]
    );
  };
  
  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleAddressChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };
  
  const handleBusinessChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [field]: value,
      },
    }));
  };
  
  const handleSocialMediaChange = (platform, value) => {
    setEditedProfile(prev => ({
      ...prev,
      business: {
        ...prev.business,
        socialMedia: {
          ...prev.business.socialMedia,
          [platform]: value,
        },
      },
    }));
  };
  
  const handleNotificationToggle = (type) => {
    setEditedProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an authentication service to log out
            console.log('User logged out');
          }
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
          },
        },
      ]
    );
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditToggle}
        >
          {isEditing ? (
            <Text style={styles.editButtonText}>Cancel</Text>
          ) : (
            <>
              <Ionicons name="pencil" size={16} color={theme.COLORS.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
            
            {isEditing && (
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Ionicons name="camera" size={16} color={theme.COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.nameSection}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Store Name"
              />
            ) : (
              <Text style={styles.storeName}>{profile.name}</Text>
            )}
            
            <View style={styles.verificationBadge}>
              <Ionicons name="checkmark-circle" size={14} color={theme.COLORS.success} />
              <Text style={styles.verificationText}>{profile.verificationStatus}</Text>
            </View>
          </View>
          
          <View style={styles.memberInfo}>
            <Text style={styles.memberText}>Member since {new Date(profile.memberSince).toLocaleDateString()}</Text>
            <View style={styles.sustainabilityContainer}>
              <Ionicons name="leaf" size={14} color={theme.COLORS.success} />
              <Text style={styles.sustainabilityText}>
                Sustainability Score: {profile.sustainabilityScore}%
              </Text>
            </View>
          </View>
        </View>
        
        {/* Store Badges */}
        <View style={styles.badgesContainer}>
          {profile.storeBadges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
        
        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Description</Text>
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={editedProfile.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Tell customers about your store and products..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.bioText}>{profile.bio}</Text>
          )}
        </View>
        
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color={theme.COLORS.gray} />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedProfile.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Email Address"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoText}>{profile.email}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color={theme.COLORS.gray} />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedProfile.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{profile.phone}</Text>
              )}
            </View>
            
            {profile.business.website && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="globe-outline" size={20} color={theme.COLORS.gray} />
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editedProfile.business.website}
                    onChangeText={(value) => handleBusinessChange('website', value)}
                    placeholder="Website"
                    keyboardType="url"
                  />
                ) : (
                  <Text style={styles.infoText}>{profile.business.website}</Text>
                )}
              </View>
            )}
          </View>
        </View>
        
        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="logo-instagram" size={20} color="#C13584" />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedProfile.business.socialMedia.instagram}
                  onChangeText={(value) => handleSocialMediaChange('instagram', value)}
                  placeholder="Instagram Handle"
                />
              ) : (
                <Text style={styles.infoText}>{profile.business.socialMedia.instagram}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="logo-facebook" size={20} color="#3b5998" />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedProfile.business.socialMedia.facebook}
                  onChangeText={(value) => handleSocialMediaChange('facebook', value)}
                  placeholder="Facebook Page Name"
                />
              ) : (
                <Text style={styles.infoText}>{profile.business.socialMedia.facebook}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="logo-tiktok" size={20} color="#000000" />
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedProfile.business.socialMedia.tiktok}
                  onChangeText={(value) => handleSocialMediaChange('tiktok', value)}
                  placeholder="TikTok Handle"
                />
              ) : (
                <Text style={styles.infoText}>{profile.business.socialMedia.tiktok}</Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Business Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Address</Text>
          <View style={styles.infoCard}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.addressInput}
                  value={editedProfile.address.street}
                  onChangeText={(value) => handleAddressChange('street', value)}
                  placeholder="Street Address"
                />
                <View style={styles.addressRow}>
                  <TextInput
                    style={[styles.addressInput, styles.cityInput]}
                    value={editedProfile.address.city}
                    onChangeText={(value) => handleAddressChange('city', value)}
                    placeholder="City"
                  />
                  <TextInput
                    style={[styles.addressInput, styles.stateInput]}
                    value={editedProfile.address.state}
                    onChangeText={(value) => handleAddressChange('state', value)}
                    placeholder="State"
                  />
                </View>
                <View style={styles.addressRow}>
                  <TextInput
                    style={[styles.addressInput, styles.zipInput]}
                    value={editedProfile.address.zipCode}
                    onChangeText={(value) => handleAddressChange('zipCode', value)}
                    placeholder="ZIP Code"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.addressInput, styles.countryInput]}
                    value={editedProfile.address.country}
                    onChangeText={(value) => handleAddressChange('country', value)}
                    placeholder="Country"
                  />
                </View>
              </>
            ) : (
              <Text style={styles.addressText}>
                {profile.address.street}{'\n'}
                {profile.address.city}, {profile.address.state} {profile.address.zipCode}{'\n'}
                {profile.address.country}
              </Text>
            )}
          </View>
        </View>
        
        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Type:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.smallInput}
                  value={editedProfile.business.type}
                  onChangeText={(value) => handleBusinessChange('type', value)}
                  placeholder="e.g., LLC, Sole Proprietor"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.business.type}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Founded Year:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.smallInput}
                  value={String(editedProfile.business.foundedYear)}
                  onChangeText={(value) => handleBusinessChange('foundedYear', value)}
                  placeholder="e.g., 2020"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.business.foundedYear}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee Count:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.smallInput}
                  value={editedProfile.business.employeeCount}
                  onChangeText={(value) => handleBusinessChange('employeeCount', value)}
                  placeholder="e.g., 1-10"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.business.employeeCount}</Text>
              )}
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tax ID:</Text>
              <Text style={styles.infoValue}>{profile.business.taxId}</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Name:</Text>
              <Text style={styles.infoValue}>{profile.banking.accountName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank:</Text>
              <Text style={styles.infoValue}>{profile.banking.bankName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Number:</Text>
              <Text style={styles.infoValue}>{profile.banking.accountNumber}</Text>
            </View>
            
            <TouchableOpacity style={styles.updateBankingButton}>
              <Text style={styles.updateBankingText}>Update Payment Details</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.infoCard}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>New Orders</Text>
              <Switch
                trackColor={{ false: "#ccc", true: theme.COLORS.primary + '50' }}
                thumbColor={editedProfile.notifications.newOrders ? theme.COLORS.primary : "#f4f3f4"}
                onValueChange={() => handleNotificationToggle('newOrders')}
                value={editedProfile.notifications.newOrders}
                disabled={!isEditing}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Order Updates</Text>
              <Switch
                trackColor={{ false: "#ccc", true: theme.COLORS.primary + '50' }}
                thumbColor={editedProfile.notifications.orderUpdates ? theme.COLORS.primary : "#f4f3f4"}
                onValueChange={() => handleNotificationToggle('orderUpdates')}
                value={editedProfile.notifications.orderUpdates}
                disabled={!isEditing}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Marketing & Promotions</Text>
              <Switch
                trackColor={{ false: "#ccc", true: theme.COLORS.primary + '50' }}
                thumbColor={editedProfile.notifications.marketing ? theme.COLORS.primary : "#f4f3f4"}
                onValueChange={() => handleNotificationToggle('marketing')}
                value={editedProfile.notifications.marketing}
                disabled={!isEditing}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Analytics & Reports</Text>
              <Switch
                trackColor={{ false: "#ccc", true: theme.COLORS.primary + '50' }}
                thumbColor={editedProfile.notifications.analytics ? theme.COLORS.primary : "#f4f3f4"}
                onValueChange={() => handleNotificationToggle('analytics')}
                value={editedProfile.notifications.analytics}
                disabled={!isEditing}
              />
            </View>
          </View>
        </View>
        
        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Help', 'Contact support at support@natureblend.com')}
            >
              <Ionicons name="help-circle-outline" size={20} color={theme.COLORS.primary} />
              <Text style={styles.actionButtonText}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Terms', 'View our terms and conditions')}
            >
              <Ionicons name="document-text-outline" size={20} color={theme.COLORS.primary} />
              <Text style={styles.actionButtonText}>Terms & Conditions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Privacy', 'View our privacy policy')}
            >
              <Ionicons name="shield-outline" size={20} color={theme.COLORS.primary} />
              <Text style={styles.actionButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.COLORS.error} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color={theme.COLORS.error} />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  editButtonText: {
    marginLeft: 4,
    color: theme.COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.COLORS.gray,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: theme.COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.COLORS.white,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    paddingBottom: 4,
    width: 250,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 6,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.success + '15',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  verificationText: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.COLORS.success,
    fontWeight: '500',
  },
  memberInfo: {
    alignItems: 'center',
  },
  memberText: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginBottom: 4,
  },
  sustainabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sustainabilityText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.COLORS.success,
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: theme.COLORS.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: theme.COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 12,
  },
  bioInput: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    color: theme.COLORS.black,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
  },
  bioText: {
    fontSize: 14,
    color: theme.COLORS.darkGray,
    lineHeight: 22,
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  infoCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 30,
    marginRight: 12,
  },
  infoInput: {
    flex: 1,
    fontSize: 14,
    color: theme.COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    paddingBottom: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.COLORS.black,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: theme.COLORS.black,
    fontWeight: '500',
  },
  smallInput: {
    flex: 1,
    fontSize: 14,
    color: theme.COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    paddingBottom: 4,
  },
  addressInput: {
    width: '100%',
    fontSize: 14,
    color: theme.COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    paddingBottom: 4,
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cityInput: {
    width: '60%',
    marginRight: 8,
  },
  stateInput: {
    width: '35%',
  },
  zipInput: {
    width: '35%',
    marginRight: 8,
  },
  countryInput: {
    width: '60%',
  },
  addressText: {
    fontSize: 14,
    color: theme.COLORS.black,
    lineHeight: 22,
  },
  updateBankingButton: {
    backgroundColor: theme.COLORS.ultraLightGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updateBankingText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: theme.COLORS.black,
  },
  actionsContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  actionButtonText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  logoutButtonText: {
    fontSize: 14,
    color: theme.COLORS.error,
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    fontSize: 14,
    color: theme.COLORS.error,
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
});

export default ProfileScreen;