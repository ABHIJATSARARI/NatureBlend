import React from 'react';
import { View, Text } from 'react-native';

const AnalyticsScreen = () => {
  const data = {
    weekly: Array.from({ length: 4 }, (_, i) => ({
      week: "Week " + (i+1),
      value: Math.floor(Math.random() * 2000) + 1000,
    })),
    monthly: Array.from({ length: 6 }, (_, i) => ({
      month: "Month " + (i+1),
      value: Math.floor(Math.random() * 5000) + 2000,
    })),
  };

  
  return (
    <View>
      <Text>Analytics Screen</Text>
      {/* Render analytics data */}
    </View>
  );
};

export default AnalyticsScreen;