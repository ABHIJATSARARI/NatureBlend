import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

// Dummy data for prototype
const featuredProducts = [
  {
    id: '1',
    name: 'Organic Ashwagandha',
    description: 'Natural stress relief supplement',
    price: 24.99,
    rating: 4.8,
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 95,
  },
  {
    id: '2',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Made from sustainable natural rubber',
    price: 49.99,
    rating: 4.7,
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 98,
  },
  {
    id: '3',
    name: 'Herbal Tea Collection',
    description: 'Assortment of wellness teas',
    price: 19.99,
    rating: 4.9,
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 92,
  },
];

const wellnessCategories = [
  {
    id: '1',
    name: 'Supplements',
    icon: 'leaf',
  },
  {
    id: '2',
    name: 'Herbal Remedies',
    icon: 'flower',
  },
  {
    id: '3',
    name: 'Meditation',
    icon: 'heart',
  },
  {
    id: '4',
    name: 'Yoga',
    icon: 'body',
  },
  {
    id: '5',
    name: 'Natural Foods',
    icon: 'nutrition',
  },
  {
    id: '6',
    name: 'Aromatherapy',
    icon: 'water',
  },
];

const wellnessTips = [
  {
    id: '1',
    title: 'Morning Rituals',
    description: 'Start your day with intention by creating a morning routine that nourishes your body and mind.',
    image: require('../../../assets/images/splash-icon.png'),
  },
  {
    id: '2',
    title: 'Mindful Eating',
    description: 'Practice being present while eating to improve digestion and create a healthier relationship with food.',
    image: require('../../../assets/images/splash-icon.png'),
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Good Morning,</Text>
            <Text style={styles.userName}>Sarah</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={28} color={theme.COLORS.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.COLORS.gray} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search natural wellness products"
            placeholderTextColor={theme.COLORS.gray}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color={theme.COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Wellness Banner */}
        <TouchableOpacity style={styles.bannerContainer}>
          <Image
            source={require('../../../assets/images/splash-icon.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Wellness Assessment</Text>
            <Text style={styles.bannerDescription}>
              Take our quiz to receive personalized wellness recommendations
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Start Now</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Wellness Categories */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Wellness Categories</Text>
          
          <View style={styles.categoriesContainer}>
            {wellnessCategories.map(category => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('Explore', { category: category.name })}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={category.icon} size={24} color={theme.COLORS.white} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Featured Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.sustainabilityBadge}>
                  <Text style={styles.sustainabilityText}>{item.sustainabilityScore}%</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.productList}
          />
        </View>
        
        {/* Daily Wellness Tips */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Wellness Tips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {wellnessTips.map(tip => (
            <TouchableOpacity key={tip.id} style={styles.tipCard}>
              <Image source={tip.image} style={styles.tipImage} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription} numberOfLines={2}>
                  {tip.description}
                </Text>
                <Text style={styles.tipReadMore}>Read More</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.COLORS.gray,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  notificationIcon: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.error,
    borderWidth: 1,
    borderColor: theme.COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 46,
    backgroundColor: theme.COLORS.white,
    borderRadius: 23,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    ...theme.SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  bannerContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 160,
    ...theme.SHADOWS.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerTextContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: theme.COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerDescription: {
    color: theme.COLORS.white,
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: theme.COLORS.primary,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  seeAllText: {
    color: theme.COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...theme.SHADOWS.small,
  },
  categoryName: {
    fontSize: 14,
    color: theme.COLORS.black,
    textAlign: 'center',
  },
  productList: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    marginRight: 15,
    ...theme.SHADOWS.small,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sustainabilityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sustainabilityText: {
    color: theme.COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: theme.COLORS.black,
    marginLeft: 4,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    ...theme.SHADOWS.small,
  },
  tipImage: {
    width: 80,
    height: 80,
  },
  tipContent: {
    flex: 1,
    padding: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginBottom: 6,
  },
  tipReadMore: {
    fontSize: 12,
    color: theme.COLORS.primary,
    fontWeight: '600',
  },
});

export default HomeScreen;