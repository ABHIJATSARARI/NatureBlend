import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Import theme
import theme from '../../constants/theme';

const AddProductScreen = ({ route, navigation }) => {
  const isEditing = route.params?.productId !== undefined;
  const editProductId = route.params?.productId;
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    weight: '',
    dimensions: '',
    tags: '',
    images: [],
    sustainabilityScore: 95,
    certifications: [],
    ingredients: '',
    featured: false,
    isOrganic: false,
    isVegan: false,
    isGlutenFree: false,
  });
  
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Categories for natural products
  const categories = [
    'Supplements',
    'Herbal Remedies',
    'Skincare',
    'Essential Oils',
    'Teas & Beverages',
    'Wellness Equipment',
    'Natural Foods',
    'Pet Wellness',
  ];
  
  // Certifications for natural products
  const certifications = [
    'USDA Organic',
    'Non-GMO Project Verified',
    'Fair Trade Certified',
    'Rainforest Alliance',
    'Certified Vegan',
    'Leaping Bunny (Cruelty-Free)',
    'Ecocert',
    'B Corporation',
    'Demeter (Biodynamic)',
  ];
  
  // Populate form data if editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, you'd fetch the product data from your API
      // For this prototype, we'll use dummy data
      const dummyProductData = {
        id: '1',
        name: 'Organic Ashwagandha',
        category: 'Supplements',
        description: 'Natural stress relief supplement made from organic ingredients, sustainably harvested and processed to maintain maximum potency.',
        price: '24.99',
        discount: '0',
        quantity: '100',
        weight: '120',
        dimensions: '5 x 5 x 10',
        tags: 'stress relief, adaptogen, organic, sleep support',
        images: [require('../../../assets/images/splash-icon.png')],
        sustainabilityScore: 95,
        certifications: ['USDA Organic', 'Non-GMO Project Verified'],
        ingredients: 'Organic Ashwagandha Root Powder (KSM-66), Vegetable Cellulose (capsule), Organic Rice Hull Concentrate',
        featured: true,
        isOrganic: true,
        isVegan: true,
        isGlutenFree: true,
      };
      
      setFormData(dummyProductData);
      setSelectedCategory(dummyProductData.category);
    }
  }, [isEditing, editProductId]);
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleInputChange('category', category);
    setShowCategoryPicker(false);
  };
  
  const toggleCertification = (certification) => {
    const updatedCertifications = [...formData.certifications];
    
    if (updatedCertifications.includes(certification)) {
      const index = updatedCertifications.indexOf(certification);
      updatedCertifications.splice(index, 1);
    } else {
      updatedCertifications.push(certification);
    }
    
    handleInputChange('certifications', updatedCertifications);
  };
  
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload images.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      const updatedImages = [...formData.images, result.assets[0].uri];
      handleInputChange('images', updatedImages);
    }
  };
  
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    handleInputChange('images', updatedImages);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    
    // Number validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    if (formData.quantity && isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Quantity must be a number';
    }
    
    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, you'd send this data to your API
      Alert.alert(
        isEditing ? 'Product Updated' : 'Product Added',
        isEditing 
          ? 'Your product has been successfully updated.' 
          : 'Your product has been successfully added to your store.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ProductsMain'),
          },
        ]
      );
    } else {
      Alert.alert('Form Error', 'Please correct the errors in the form.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Images */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Images*</Text>
            <View style={styles.imagesContainer}>
              {formData.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image 
                    source={typeof image === 'number' ? image : { uri: image }} 
                    style={styles.productImage}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={handleImagePick}
              >
                <Ionicons name="add" size={40} color={theme.COLORS.primary} />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            </View>
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </View>
          
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name*</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter product name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category*</Text>
              <TouchableOpacity
                style={[styles.input, styles.dropdownInput, errors.category && styles.inputError]}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={selectedCategory ? styles.dropdownText : styles.placeholderText}>
                  {selectedCategory || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.COLORS.gray} />
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              
              {showCategoryPicker && (
                <View style={styles.dropdown}>
                  <ScrollView style={styles.dropdownScrollView}>
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleCategorySelect(category)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          selectedCategory === category && styles.selectedDropdownItem
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description*</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                textAlignVertical="top"
                numberOfLines={6}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>
          
          {/* Pricing & Inventory */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing & Inventory</Text>
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Price*</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput, errors.price && styles.inputError]}
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(text) => handleInputChange('price', text)}
                    keyboardType="decimal-pad"
                  />
                </View>
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Discount (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.discount}
                  onChangeText={(text) => handleInputChange('discount', text)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity in Stock*</Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="Enter available quantity"
                value={formData.quantity}
                onChangeText={(text) => handleInputChange('quantity', text)}
                keyboardType="number-pad"
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Weight (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange('weight', text)}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Dimensions (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="L x W x H"
                  value={formData.dimensions}
                  onChangeText={(text) => handleInputChange('dimensions', text)}
                />
              </View>
            </View>
          </View>
          
          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags (separated by commas)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., organic, vegan, herbal"
                value={formData.tags}
                onChangeText={(text) => handleInputChange('tags', text)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ingredients</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List all ingredients..."
                value={formData.ingredients}
                onChangeText={(text) => handleInputChange('ingredients', text)}
                multiline
                textAlignVertical="top"
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Certifications</Text>
              <View style={styles.certificationsContainer}>
                {certifications.map((certification, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.certificationTag,
                      formData.certifications.includes(certification) && styles.selectedCertification
                    ]}
                    onPress={() => toggleCertification(certification)}
                  >
                    {formData.certifications.includes(certification) && (
                      <Ionicons name="checkmark" size={16} color={theme.COLORS.white} style={styles.checkIcon} />
                    )}
                    <Text 
                      style={[
                        styles.certificationText,
                        formData.certifications.includes(certification) && styles.selectedCertificationText
                      ]}
                    >
                      {certification}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.sustainabilityContainer}>
              <Text style={styles.inputLabel}>Sustainability Score</Text>
              <View style={styles.sustainabilityScoreContainer}>
                <View style={styles.sustainabilityBar}>
                  <View 
                    style={[
                      styles.sustainabilityFill, 
                      { width: `${formData.sustainabilityScore}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.sustainabilityText}>{formData.sustainabilityScore}%</Text>
              </View>
              <Text style={styles.sustainabilityNote}>
                Sustainability score is calculated based on your product certifications, 
                ingredients, and packaging information.
              </Text>
            </View>
          </View>
          
          {/* Product Attributes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Attributes</Text>
            
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Ionicons name="star" size={20} color={theme.COLORS.warning} />
                <Text style={styles.switchText}>Feature this product</Text>
              </View>
              <Switch
                value={formData.featured}
                onValueChange={(value) => handleInputChange('featured', value)}
                trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary + '80' }}
                thumbColor={formData.featured ? theme.COLORS.primary : theme.COLORS.white}
              />
            </View>
            
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Ionicons name="leaf" size={20} color={theme.COLORS.success} />
                <Text style={styles.switchText}>Organic</Text>
              </View>
              <Switch
                value={formData.isOrganic}
                onValueChange={(value) => handleInputChange('isOrganic', value)}
                trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary + '80' }}
                thumbColor={formData.isOrganic ? theme.COLORS.primary : theme.COLORS.white}
              />
            </View>
            
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Ionicons name="nutrition" size={20} color={theme.COLORS.success} />
                <Text style={styles.switchText}>Vegan</Text>
              </View>
              <Switch
                value={formData.isVegan}
                onValueChange={(value) => handleInputChange('isVegan', value)}
                trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary + '80' }}
                thumbColor={formData.isVegan ? theme.COLORS.primary : theme.COLORS.white}
              />
            </View>
            
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Ionicons name="restaurant" size={20} color={theme.COLORS.warning} />
                <Text style={styles.switchText}>Gluten Free</Text>
              </View>
              <Switch
                value={formData.isGlutenFree}
                onValueChange={(value) => handleInputChange('isGlutenFree', value)}
                trackColor={{ false: theme.COLORS.lightGray, true: theme.COLORS.primary + '80' }}
                thumbColor={formData.isGlutenFree ? theme.COLORS.primary : theme.COLORS.white}
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>{isEditing ? 'Update Product' : 'Add Product'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.COLORS.black,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.COLORS.black,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    padding: 2,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: theme.COLORS.primary,
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.COLORS.gray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputError: {
    borderColor: theme.COLORS.error,
  },
  errorText: {
    color: theme.COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingLeft: 15,
  },
  currencySymbol: {
    fontSize: 16,
    color: theme.COLORS.gray,
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: theme.COLORS.black,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.COLORS.gray,
  },
  dropdown: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    marginTop: 5,
    ...theme.SHADOWS.medium,
    zIndex: 10,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.ultraLightGray,
  },
  dropdownItemText: {
    fontSize: 16,
    color: theme.COLORS.black,
  },
  selectedDropdownItem: {
    fontWeight: '600',
    color: theme.COLORS.primary,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certificationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.ultraLightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCertification: {
    backgroundColor: theme.COLORS.primary,
  },
  certificationText: {
    fontSize: 14,
    color: theme.COLORS.gray,
  },
  selectedCertificationText: {
    color: theme.COLORS.white,
  },
  checkIcon: {
    marginRight: 5,
  },
  sustainabilityContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sustainabilityScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sustainabilityBar: {
    flex: 1,
    height: 10,
    backgroundColor: theme.COLORS.ultraLightGray,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 15,
  },
  sustainabilityFill: {
    height: '100%',
    backgroundColor: theme.COLORS.primary,
    borderRadius: 5,
  },
  sustainabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
  },
  sustainabilityNote: {
    fontSize: 12,
    color: theme.COLORS.gray,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: theme.COLORS.black,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.lightGray,
    borderRadius: 8,
    paddingVertical: 14,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.COLORS.black,
    fontWeight: '500',
  },
  submitButton: {
    flex: 2,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: theme.COLORS.white,
    fontWeight: '600',
  },
});

export default AddProductScreen;