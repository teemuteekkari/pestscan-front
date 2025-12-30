import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnalyticsDashboardScreen from '../screens/analytics/AnalyticsDashboardScreen';
import HeatMapScreen from '../screens/analytics/HeatMapScreen';
import ReportsScreen from '../screens/analytics/ReportScreen';

export type AnalyticsStackParamList = {
  AnalyticsDashboard: { farmId?: string };
  Heatmap: { farmId: string; week?: number; year?: number };
  Reports: { farmId: string };
};

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

const AnalyticsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AnalyticsDashboard"
        component={AnalyticsDashboardScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name="Heatmap"
        component={HeatMapScreen}
        options={{ title: 'Heat Map' }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
    </Stack.Navigator>
  );
};

export default AnalyticsNavigator;