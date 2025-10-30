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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import theme from '../../constants/theme';


// Mock data for vendor products
const PRODUCTS_DATA = [
  {
    id: '1',
    name: 'Organic Ashwagandha Root Powder',
    category: 'Supplements',
    price: 24.99,
    stock: 145,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.8,
    salesCount: 86,
  },
  {
    id: '2',
    name: 'Herbal Tea Collection',
    category: 'Teas & Beverages',
    price: 19.99,
    stock: 72,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.9,
    salesCount: 54,
  },
  {
    id: '3',
    name: 'Natural Face Serum',
    category: 'Skincare',
    price: 29.99,
    stock: 38,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.6,
    salesCount: 42,
  },
  {
    id: '4',
    name: 'Reusable Bamboo Utensil Set',
    category: 'Eco Living',
    price: 15.99,
    stock: 54,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.7,
    salesCount: 38,
  },
  {
    id: '5',
    name: 'Meditation Cushion Set',
    category: 'Wellness',
    price: 42.99,
    stock: 27,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.8,
    salesCount: 26,
  },
  {
    id: '6',
    name: 'Eco-friendly Yoga Mat',
    category: 'Wellness',
    price: 39.99,
    stock: 18,
    active: false,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.5,
    salesCount: 31,
  },
  {
    id: '7',
    name: 'Pure Coconut Oil',
    category: 'Food & Nutrition',
    price: 12.99,
    stock: 85,
    active: true,
    image: require('../../../assets/images/logo1.png'),
    rating: 4.9,
    salesCount: 67,
  },
];

// All possible categories
const ALL_CATEGORIES = [
  'All',
  'Teas & Infusions',
  'Skincare',
  'Supplements',
  'Aromatherapy',
  'Eco Living',
  'Wellness',
];

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('name_asc'); // Default sorting

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the mock data and a timeout to simulate loading
        setTimeout(() => {
          setProducts(PRODUCTS_DATA);
          setFilteredProducts(PRODUCTS_DATA);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...products];
    
    // Apply search query
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply active/inactive filter
    if (activeFilter === 'Active') {
      result = result.filter(product => product.isActive);
    } else if (activeFilter === 'Inactive') {
      result = result.filter(product => !product.isActive);
    } else if (activeFilter === 'Out of Stock') {
      result = result.filter(product => product.stock === 0);
    } else if (activeFilter === 'Organic') {
      result = result.filter(product => product.isOrganic);
    }
    
    // Apply sorting
    result = sortProducts(result, sortOrder);
    
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, activeFilter, products, sortOrder]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
  };

  const sortProducts = (productsToSort, sortType) => {
    const sorted = [...productsToSort];
    
    switch (sortType) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock_asc':
        return sorted.sort((a, b) => a.stock - b.stock);
      case 'stock_desc':
        return sorted.sort((a, b) => b.stock - a.stock);
      case 'sales_desc':
        return sorted.sort((a, b) => b.sales - a.sales);
      case 'rating_desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  const navigateToAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const navigateToEditProduct = (productId) => {
    navigation.navigate('EditProduct', { productId });
  };

  const toggleProductStatus = (productId) => {
    // In a real app, this would call an API
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            isActive: !product.isActive
          };
        }
        return product;
      });
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigateToEditProduct(item.id)}
    >
      <Image 
        source={item.image} 
        style={styles.productImage} 
      />
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={[
            styles.stockIndicator, 
            { backgroundColor: item.stock > 0 ? theme.COLORS.success + '20' : theme.COLORS.error + '20' }
          ]}>
            <Text style={[
              styles.stockText,
              { color: item.stock > 0 ? theme.COLORS.success : theme.COLORS.error }
            ]}>
              {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
            </Text>
          </View>
        </View>
        
        <View style={styles.productMeta}>
          <Text style={styles.categoryTag}>{item.category}</Text>
          {item.isOrganic && (
            <View style={styles.organicBadge}>
              <Ionicons name="leaf" size={12} color={theme.COLORS.white} />
              <Text style={styles.organicText}>Organic</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color={theme.COLORS.warning} />
            <Text style={styles.statText}>{item.rating} ({item.reviews})</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={14} color={theme.COLORS.success} />
            <Text style={styles.statText}>{item.sales} sold</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="leaf" size={14} color={theme.COLORS.primary} />
            <Text style={styles.statText}>{item.sustainability}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.productActions}>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            { backgroundColor: item.isActive ? theme.COLORS.primary + '20' : theme.COLORS.gray + '20' }
          ]}
          onPress={() => toggleProductStatus(item.id)}
        >
          <Text style={[
            styles.statusButtonText, 
            { color: item.isActive ? theme.COLORS.primary : theme.COLORS.gray }
          ]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToAddProduct}
        >
          <Ionicons name="add" size={24} color={theme.COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>
      
      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContainer}
        >
          {ALL_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryBtn,
                selectedCategory === category && styles.activeCategoryBtn,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryBtnText,
                  selectedCategory === category && styles.activeCategoryBtnText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Filter & Sort Row */}
      <View style={styles.filterSortContainer}>
        <View style={styles.filterButtons}>
          {['All', 'Active', 'Inactive', 'Out of Stock', 'Organic'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterBtn,
                activeFilter === filter && styles.activeFilterBtn,
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  activeFilter === filter && styles.activeFilterBtnText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              // Simple toggle between most common sort options
              if (sortOrder === 'name_asc') {
                handleSortChange('price_desc');
              } else if (sortOrder === 'price_desc') {
                handleSortChange('sales_desc');
              } else if (sortOrder === 'sales_desc') {
                handleSortChange('stock_asc');
              } else {
                handleSortChange('name_asc');
              }
            }}
          >
            <Text style={styles.sortButtonText}>
              {sortOrder === 'name_asc' && 'Name A-Z'}
              {sortOrder === 'price_desc' && 'Price ↓'}
              {sortOrder === 'sales_desc' && 'Best Selling'}
              {sortOrder === 'stock_asc' && 'Low Stock'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={theme.COLORS.gray} />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color={theme.COLORS.lightGray} />
          <Text style={styles.emptyTitle}>No Products Found</Text>
          <Text style={styles.emptyMessage}>
            {searchQuery
              ? `No results match "${searchQuery}"`
              : `You don't have any products in this category yet`}
          </Text>
          <TouchableOpacity 
            style={styles.addProductButton}
            onPress={navigateToAddProduct}
          >
            <Ionicons name="add-circle" size={18} color={theme.COLORS.white} />
            <Text style={styles.addProductText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
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
  addButton: {
    backgroundColor: theme.COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
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
  filtersContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  categoriesScrollContainer: {
    paddingHorizontal: 8,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginRight: 8,
  },
  activeCategoryBtn: {
    backgroundColor: theme.COLORS.primary,
  },
  categoryBtnText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  activeCategoryBtnText: {
    color: theme.COLORS.white,
    fontWeight: '500',
  },
  filterSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 3,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterBtn: {
    backgroundColor: theme.COLORS.primary + '20',
  },
  filterBtnText: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  activeFilterBtnText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sortLabel: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginRight: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.ultraLightGray,
  },
  sortButtonText: {
    fontSize: 12,
    color: theme.COLORS.darkGray,
    marginRight: 4,
  },
  productsList: {
    padding: 16,
    paddingTop: 4,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: theme.COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: theme.COLORS.ultraLightGray,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productHeader: {
    marginBottom: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 4,
  },
  stockIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryTag: {
    fontSize: 12,
    color: theme.COLORS.gray,
    marginRight: 8,
  },
  organicBadge: {
    backgroundColor: theme.COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  organicText: {
    color: theme.COLORS.white,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: theme.COLORS.darkGray,
    marginLeft: 4,
  },
  productActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addProductText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ProductsScreen;