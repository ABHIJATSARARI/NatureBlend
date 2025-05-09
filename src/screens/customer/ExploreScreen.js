import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Dummy data for categories
const categories = [
  { id: '1', name: 'Supplements', icon: 'medical-outline' },
  { id: '2', name: 'Skincare', icon: 'water-outline' },
  { id: '3', name: 'Essential Oils', icon: 'flask-outline' },
  { id: '4', name: 'Teas', icon: 'cafe-outline' },
  { id: '5', name: 'Wellness', icon: 'leaf-outline' },
  { id: '6', name: 'Natural Foods', icon: 'nutrition-outline' },
];

// Dummy data for products
const products = [
  {
    id: '1',
    name: 'Organic Ashwagandha',
    description: 'Natural stress relief supplement made from organic ingredients, sustainably harvested.',
    price: 24.99,
    discountPrice: null,
    rating: 4.8,
    reviewCount: 124,
    category: 'Supplements',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 95,
    vendor: 'Mountain Herbs',
    labels: ['organic', 'vegan'],
    isNew: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Natural Face Serum',
    description: 'Hydrating serum with natural botanicals and antioxidants',
    price: 29.99,
    discountPrice: 24.99,
    rating: 4.6,
    reviewCount: 89,
    category: 'Skincare',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 88,
    vendor: 'Pure Botanicals',
    labels: ['cruelty-free', 'eco-friendly'],
    isNew: false,
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Eco-Friendly Yoga Mat',
    description: 'Made from sustainable natural rubber and organic cotton',
    price: 49.99,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 56,
    category: 'Wellness',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 98,
    vendor: 'EcoWellness Co.',
    labels: ['eco-friendly', 'biodegradable'],
    isNew: true,
    isBestseller: false,
  },
  {
    id: '4',
    name: 'Herbal Tea Collection',
    description: 'Set of 5 organic herbal teas for relaxation and wellness',
    price: 19.99,
    discountPrice: null,
    rating: 4.9,
    reviewCount: 203,
    category: 'Teas',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 92,
    vendor: 'Serene Leaf',
    labels: ['organic', 'fair-trade'],
    isNew: false,
    isBestseller: true,
  },
  {
    id: '5',
    name: 'Lavender Essential Oil',
    description: 'Pure essential oil for aromatherapy and relaxation',
    price: 15.99,
    discountPrice: 12.99,
    rating: 4.7,
    reviewCount: 142,
    category: 'Essential Oils',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 90,
    vendor: 'Aromatic Essence',
    labels: ['pure', 'undiluted'],
    isNew: false,
    isBestseller: false,
  },
  {
    id: '6',
    name: 'Organic Protein Powder',
    description: 'Plant-based protein with no artificial ingredients',
    price: 39.99,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 78,
    category: 'Natural Foods',
    image: require('../../../assets/images/splash-icon.png'),
    sustainabilityScore: 87,
    vendor: 'Green Nutrition',
    labels: ['organic', 'plant-based'],
    isNew: true,
    isBestseller: false,
  },
];

// Dummy data for collections
const collections = [
  {
    id: '1',
    title: 'Summer Wellness',
    description: 'Stay healthy and refreshed with these summer essentials',
    image: require('../../../assets/images/splash-icon.png'),
  },
  {
    id: '2',
    title: 'Immunity Boosters',
    description: 'Natural supplements to strengthen your immune system',
    image: require('../../../assets/images/splash-icon.png'),
  },
  {
    id: '3',
    title: 'Self-Care Essentials',
    description: 'Products to enhance your self-care routine',
    image: require('../../../assets/images/splash-icon.png'),
  },
];

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Filter products based on search query and selected category
  useEffect(() => {
    let result = products;
    
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply secondary filters
    if (activeFilter === 'New') {
      result = result.filter(item => item.isNew);
    } else if (activeFilter === 'Bestsellers') {
      result = result.filter(item => item.isBestseller);
    } else if (activeFilter === 'On Sale') {
      result = result.filter(item => item.discountPrice !== null);
    } else if (activeFilter === 'High Rating') {
      result = result.filter(item => item.rating >= 4.7);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, activeFilter]);
  
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryName ? '' : categoryName
    );
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };
  
  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };
  
  const navigateToCollection = (collectionId, collectionTitle) => {
    navigation.navigate('Collection', { collectionId, collectionTitle });
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategorySelect(item.name)}
    >
      <View style={[
        styles.categoryIconContainer,
        selectedCategory === item.name && styles.selectedCategoryIconContainer,
      ]}>
        <Ionicons
          name={item.icon}
          size={20}
          color={selectedCategory === item.name ? theme.COLORS.white : theme.COLORS.primary}
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.name && styles.selectedCategoryName,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigateToProductDetail(item.id)}
    >
      {/* Product Labels */}
      <View style={styles.labelContainer}>
        {item.isNew && (
          <View style={[styles.label, styles.newLabel]}>
            <Text style={styles.labelText}>NEW</Text>
          </View>
        )}
        {item.discountPrice && (
          <View style={[styles.label, styles.saleLabel]}>
            <Text style={styles.labelText}>SALE</Text>
          </View>
        )}
      </View>
      
      {/* Product Image */}
      <Image source={item.image} style={styles.productImage} />
      
      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <View style={styles.sustainabilityBadge}>
            <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
            <Text style={styles.sustainabilityText}>{item.sustainabilityScore}</Text>
          </View>
        </View>
        
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(item.rating) ? 'star' : star <= item.rating ? 'star-half' : 'star-outline'}
                size={12}
                color="#FFD700"
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          {item.discountPrice ? (
            <>
              <Text style={styles.discountPrice}>${item.discountPrice.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          )}
        </View>
        
        {/* Product Labels */}
        <View style={styles.productLabelsContainer}>
          {item.labels.map((label, index) => (
            <View key={index} style={styles.productLabel}>
              <Text style={styles.productLabelText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionCard}
      onPress={() => navigateToCollection(item.id, item.title)}
    >
      <Image source={item.image} style={styles.collectionImage} />
      <View style={styles.collectionOverlay}>
        <Text style={styles.collectionTitle}>{item.title}</Text>
        <Text style={styles.collectionDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.collectionButton}>
          <Text style={styles.collectionButtonText}>Explore</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.COLORS.white} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart-outline" size={24} color={theme.COLORS.black} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search natural products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.sectionContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Collections */}
        {!searchQuery && !selectedCategory && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Collections</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={collections}
              renderItem={renderCollectionItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionsList}
            />
          </View>
        )}
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {['All', 'New', 'Bestsellers', 'On Sale', 'High Rating'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Products */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory || (searchQuery ? 'Search Results' : 'All Products')}
            </Text>
            <Text style={styles.productCount}>{filteredProducts.length} items</Text>
          </View>
          
          {filteredProducts.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={50} color={theme.COLORS.lightGray} />
              <Text style={styles.noResultsText}>No products found</Text>
              <Text style={styles.noResultsSubText}>
                Try adjusting your search or filters
              </Text>
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setActiveFilter('All');
                }}
              >
                <Text style={styles.resetFiltersText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  {renderProductCard({ item: product })}
                </View>
              ))}
            </View>
          )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
    backgroundColor: theme.COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  headerAction: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
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
  sectionContainer: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.COLORS.white,
    ...theme.SHADOWS.small,
  },
  selectedCategoryItem: {
    backgroundColor: theme.COLORS.primary + '20',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.ultraLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedCategoryIconContainer: {
    backgroundColor: theme.COLORS.primary,
  },
  categoryName: {
    fontSize: 12,
    color: theme.COLORS.black,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
  collectionsList: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  collectionCard: {
    width: width * 0.8,
    height: 150,
    borderRadius: 12,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.white,
    marginBottom: 5,
  },
  collectionDescription: {
    fontSize: 14,
    color: theme.COLORS.white,
    opacity: 0.9,
    marginBottom: 10,
  },
  collectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionButtonText: {
    fontSize: 14,
    color: theme.COLORS.white,
    fontWeight: '500',
    marginRight: 5,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
  },
  activeFilterButton: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: theme.COLORS.black,
  },
  activeFilterText: {
    color: theme.COLORS.white,
    fontWeight: '500',
  },
  productsSection: {
    paddingBottom: 20,
  },
  productCount: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    color: theme.COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 8,
  },
  resetFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.white,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  productContainer: {
    width: '50%',
    padding: 4,
  },
  productCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
    ...theme.SHADOWS.small,
  },
  labelContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    flexDirection: 'row',
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  newLabel: {
    backgroundColor: theme.COLORS.primary,
  },
  saleLabel: {
    backgroundColor: theme.COLORS.error,
  },
  labelText: {
    color: theme.COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 10,
    color: theme.COLORS.gray,
    textTransform: 'uppercase',
  },
  sustainabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sustainabilityText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 2,
    height: 40,
  },
  vendorName: {
    fontSize: 12,
    color: theme.COLORS.primary,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 10,
    color: theme.COLORS.gray,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.error,
  },
  originalPrice: {
    fontSize: 12,
    color: theme.COLORS.gray,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  productLabelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  productLabel: {
    backgroundColor: theme.COLORS.ultraLightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  productLabelText: {
    fontSize: 8,
    color: theme.COLORS.black,
  },
});

export default ExploreScreen;