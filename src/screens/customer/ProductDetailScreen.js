import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import theme
import theme from '../../constants/theme';

const { width } = Dimensions.get('window');

// Mock product data
const productData = {
  id: '1',
  name: 'Organic Ashwagandha Root Powder',
  description: 'Our premium organic ashwagandha root powder is sustainably harvested from the finest farms in India. This adaptogenic herb has been used for centuries in Ayurvedic medicine to help the body resist physiological and psychological stress. Our powder is lab-tested for purity and potency.',
  price: 24.99,
  discountPrice: null,
  rating: 4.8,
  reviewCount: 124,
  category: 'Supplements',
  images: [
    require('../../../assets/images/logo1.png'),
    require('../../../assets/images/logo1.png'),
    require('../../../assets/images/logo1.png'),
  ],
  sustainabilityScore: 95,
  vendor: {
    name: 'Mountain Herbs',
    rating: 4.9,
    verified: true,
  },
  labels: ['organic', 'vegan', 'non-gmo', 'gluten-free'],
  benefits: [
    'Helps reduce stress and anxiety',
    'Supports immune system function',
    'Improves energy and vitality',
    'Enhances mental clarity and focus',
  ],
  usage: 'Take 1-2 teaspoons (5-10g) daily. Can be mixed with water, juice, or added to smoothies.',
  ingredients: 'Organic Ashwagandha Root Powder (Withania somnifera)',
  available: true,
  stock: 145,
  shipping: {
    eco_friendly: true,
    carbon_neutral: true,
    estimated_days: '3-5',
  },
  related_products: [
    {
      id: '2',
      name: 'Natural Face Serum',
      price: 29.99,
      discountPrice: 24.99,
      image: require('../../../assets/images/logo1.png'),
      rating: 4.6,
    },
    {
      id: '4',
      name: 'Herbal Tea Collection',
      price: 19.99,
      discountPrice: null,
      image: require('../../../assets/images/logo1.png'),
      rating: 4.9,
    },
    {
      id: '5',
      name: 'Lavender Essential Oil',
      price: 15.99,
      discountPrice: 12.99,
      image: require('../../../assets/images/logo1.png'),
      rating: 4.7,
    },
  ]
};

const ProductDetailScreen = ({ navigation, route }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState('description');
  const scrollY = new Animated.Value(0);

  // In a real app, we would fetch the product data based on productId
  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      setProduct(productData);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {
    // In a real app, add the product to cart with the selected quantity
    navigation.navigate('Cart');
  };

  const handleBuyNow = () => {
    // In a real app, add the product to cart and navigate to checkout
    navigation.navigate('Checkout');
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleToggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderImagePagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {product?.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentImageIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  // Animated header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 60],
    extrapolate: 'clamp',
  });

  const renderRelatedProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedProductCard}
      onPress={() => navigation.push('ProductDetail', { productId: item.id })}
    >
      <Image source={item.image} style={styles.relatedProductImage} />
      <View style={styles.relatedProductInfo}>
        <Text style={styles.relatedProductName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.relatedProductPriceRow}>
          {item.discountPrice ? (
            <>
              <Text style={styles.discountPrice}>${item.discountPrice}</Text>
              <Text style={styles.originalPrice}>${item.price}</Text>
            </>
          ) : (
            <Text style={styles.price}>${item.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
            height: headerHeight,
          },
        ]}
      >
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product?.name}
        </Text>
      </Animated.View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.COLORS.black} />
      </TouchableOpacity>

      {/* Heart/Favorite Button */}
      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart-outline" size={24} color={theme.COLORS.black} />
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Ionicons name="share-outline" size={22} color={theme.COLORS.black} />
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Product Images Carousel */}
            <View style={styles.imageContainer}>
              <FlatList
                data={product?.images}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.productImage} />
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const slideIndex = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setCurrentImageIndex(slideIndex);
                }}
              />
              {renderImagePagination()}
              
              {/* Sustainability Badge */}
              <View style={styles.sustainabilityBadge}>
                <View style={styles.sustainabilityScoreContainer}>
                  <Ionicons name="leaf" size={16} color={theme.COLORS.white} />
                  <Text style={styles.sustainabilityScore}>
                    {product?.sustainabilityScore}
                  </Text>
                </View>
                <Text style={styles.sustainabilityText}>Eco Score</Text>
              </View>
            </View>

            <View style={styles.contentContainer}>
              {/* Vendor Info */}
              <TouchableOpacity 
                style={styles.vendorContainer}
                onPress={() => navigation.navigate('VendorDetail', { vendorId: product.vendor.id })}
              >
                <Text style={styles.vendorName}>{product?.vendor.name}</Text>
                {product?.vendor.verified && (
                  <Ionicons name="checkmark-circle" size={14} color={theme.COLORS.primary} />
                )}
              </TouchableOpacity>

              {/* Product Name & Price */}
              <Text style={styles.productName}>{product?.name}</Text>
              
              {/* Rating */}
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Math.floor(product?.rating) ? 'star' : star <= product?.rating ? 'star-half' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                <Text style={styles.rating}>{product?.rating}</Text>
                <Text style={styles.reviewCount}>({product?.reviewCount} reviews)</Text>
                <TouchableOpacity 
                  style={styles.viewReviewsButton}
                  onPress={() => navigation.navigate('Reviews', { productId: product.id })}
                >
                  <Text style={styles.viewReviewsText}>View All</Text>
                </TouchableOpacity>
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                {product?.discountPrice ? (
                  <>
                    <Text style={styles.discountPrice}>${product?.discountPrice}</Text>
                    <Text style={styles.originalPrice}>${product?.price}</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountPercentage}>
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.price}>${product?.price}</Text>
                )}
              </View>

              {/* Product Labels */}
              <View style={styles.labelsContainer}>
                {product?.labels.map((label, index) => (
                  <View key={index} style={styles.labelBadge}>
                    <Text style={styles.labelText}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Stock Status */}
              <View style={styles.stockContainer}>
                <Ionicons 
                  name={product?.stock > 30 ? "checkmark-circle" : "time-outline"} 
                  size={16} 
                  color={product?.stock > 30 ? theme.COLORS.success : theme.COLORS.warning} 
                />
                <Text style={[
                  styles.stockText,
                  { color: product?.stock > 30 ? theme.COLORS.success : theme.COLORS.warning }
                ]}>
                  {product?.stock > 30 
                    ? 'In Stock' 
                    : product?.stock > 0 
                      ? `Low Stock (${product?.stock} left)` 
                      : 'Out of Stock'
                  }
                </Text>
              </View>

              {/* Shipping Info */}
              <View style={styles.shippingContainer}>
                <View style={styles.shippingItem}>
                  <Ionicons name="bicycle-outline" size={16} color={theme.COLORS.gray} />
                  <Text style={styles.shippingText}>
                    Delivery: {product?.shipping.estimated_days} business days
                  </Text>
                </View>
                
                {product?.shipping.eco_friendly && (
                  <View style={styles.shippingItem}>
                    <Ionicons name="leaf-outline" size={16} color={theme.COLORS.success} />
                    <Text style={[styles.shippingText, {color: theme.COLORS.success}]}>
                      Eco-friendly packaging
                    </Text>
                  </View>
                )}
                
                {product?.shipping.carbon_neutral && (
                  <View style={styles.shippingItem}>
                    <Ionicons name="earth-outline" size={16} color={theme.COLORS.success} />
                    <Text style={[styles.shippingText, {color: theme.COLORS.success}]}>
                      Carbon-neutral shipping
                    </Text>
                  </View>
                )}
              </View>

              {/* Collapsible Sections */}
              <View style={styles.sectionsContainer}>
                {/* Description Section */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => handleToggleSection('description')}
                >
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Ionicons
                    name={expandedSection === 'description' ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
                
                {expandedSection === 'description' && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.descriptionText}>{product?.description}</Text>
                  </View>
                )}
                
                <View style={styles.sectionDivider} />
                
                {/* Benefits Section */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => handleToggleSection('benefits')}
                >
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  <Ionicons
                    name={expandedSection === 'benefits' ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
                
                {expandedSection === 'benefits' && (
                  <View style={styles.sectionContent}>
                    {product?.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={16} color={theme.COLORS.primary} />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                <View style={styles.sectionDivider} />
                
                {/* Usage Section */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => handleToggleSection('usage')}
                >
                  <Text style={styles.sectionTitle}>How to Use</Text>
                  <Ionicons
                    name={expandedSection === 'usage' ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
                
                {expandedSection === 'usage' && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.usageText}>{product?.usage}</Text>
                  </View>
                )}
                
                <View style={styles.sectionDivider} />
                
                {/* Ingredients Section */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => handleToggleSection('ingredients')}
                >
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  <Ionicons
                    name={expandedSection === 'ingredients' ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.COLORS.gray}
                  />
                </TouchableOpacity>
                
                {expandedSection === 'ingredients' && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.ingredientsText}>{product?.ingredients}</Text>
                  </View>
                )}
              </View>

              {/* Related Products */}
              <View style={styles.relatedProductsContainer}>
                <Text style={styles.relatedProductsTitle}>You May Also Like</Text>
                <FlatList
                  data={product?.related_products}
                  renderItem={renderRelatedProductItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.relatedProductsList}
                />
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity <= 1 ? theme.COLORS.lightGray : theme.COLORS.black}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange('increase')}
              >
                <Ionicons name="add" size={20} color={theme.COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.buyNowButton}
                onPress={handleBuyNow}
              >
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: 100, // Provide space for bottom bar
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartButton: {
    position: 'absolute',
    top: 50,
    right: 65,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.COLORS.white,
    zIndex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: theme.COLORS.white,
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.COLORS.lightGray,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: theme.COLORS.primary,
  },
  sustainabilityBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  sustainabilityScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sustainabilityScore: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sustainabilityText: {
    color: theme.COLORS.white,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 20,
  },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 14,
    color: theme.COLORS.primary,
    marginRight: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.black,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  viewReviewsButton: {
    marginLeft: 'auto',
  },
  viewReviewsText: {
    fontSize: 14,
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.black,
  },
  discountPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.COLORS.error,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: theme.COLORS.gray,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: theme.COLORS.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.COLORS.error,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  labelBadge: {
    backgroundColor: theme.COLORS.ultraLightGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 12,
    color: theme.COLORS.black,
    textTransform: 'capitalize',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stockText: {
    fontSize: 14,
    marginLeft: 5,
  },
  shippingContainer: {
    backgroundColor: theme.COLORS.ultraLightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  shippingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shippingText: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginLeft: 8,
  },
  sectionsContainer: {
    marginBottom: 20,
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    ...theme.SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  sectionContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.COLORS.ultraLightGray,
    marginHorizontal: 15,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.COLORS.gray,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.COLORS.gray,
    marginLeft: 8,
    flex: 1,
  },
  usageText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.COLORS.gray,
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.COLORS.gray,
  },
  relatedProductsContainer: {
    marginVertical: 10,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 15,
  },
  relatedProductsList: {
    paddingBottom: 10,
  },
  relatedProductCard: {
    width: 150,
    borderRadius: 10,
    backgroundColor: theme.COLORS.white,
    marginRight: 15,
    ...theme.SHADOWS.small,
    overflow: 'hidden',
  },
  relatedProductImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  relatedProductInfo: {
    padding: 10,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.COLORS.black,
    marginBottom: 5,
    height: 40,
  },
  relatedProductPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.COLORS.white,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.ultraLightGray,
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    alignItems: 'center',
    ...theme.SHADOWS.medium,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 12,
  },
  addToCartButton: {
    flex: 1,
    height: 45,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.primary,
  },
  buyNowButton: {
    flex: 1,
    height: 45,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.white,
  },
});

export default ProductDetailScreen;