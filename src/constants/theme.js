import { DefaultTheme } from '@react-navigation/native';
import { Platform } from 'react-native';

// App theme configuration
const theme = {
  // Core colors
  COLORS: {
    // Primary brand colors
    primary: '#3a9e60',       // Main green color for the customer app
    secondary: '#49a578',     // Secondary green for the vendor app
    accent: '#ff7d4d',        // Orange accent color for CTAs and highlights
    
    // UI colors
    background: '#F9FAFB',    // Light background for screens
    card: '#FFFFFF',          // Card backgrounds
    white: '#FFFFFF',
    black: '#212121',         // Not pure black for better readability
    
    // Status colors
    success: '#4CAF50',       // Green success state
    error: '#F44336',         // Red error state
    warning: '#FFC107',       // Yellow warning state
    info: '#2196F3',          // Blue info state
    
    // Neutral colors
    gray: '#757575',          // Primary text color
    lightGray: '#E0E0E0',     // Borders, dividers
    ultraLightGray: '#F5F5F5', // Background for disabled states
    
    // Category colors
    herbal: '#8BC34A',        // For herbal products
    organic: '#4CAF50',       // For organic products
    wellness: '#009688',      // For wellness services
    natural: '#66BB6A',       // For natural products
    sustainable: '#81C784',   // For sustainable products
  },

  // Font configurations
  FONTS: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },

  // Font sizes
  SIZES: {
    // Typography
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    
    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    // Border radius
    radius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      circle: 999,
    },
    
    // Icon sizes
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },
  },

  // Shadow styles for elevation
  SHADOWS: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    small: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
    medium: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    large: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  // Screen dimensions
  DIMENSIONS: {
    maxWidth: 420, // Max width for content containers
  },
  
  // Animation durations
  ANIMATION: {
    short: 150,
    medium: 300,
    long: 500,
  }
};

export default theme;