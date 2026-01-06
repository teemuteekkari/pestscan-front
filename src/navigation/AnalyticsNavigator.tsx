// src/navigation/AnalyticsNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnalyticsDashboardScreen from '../screens/analytics/AnalyticsDashboardScreen';
import HeatMapScreen from '../screens/analytics/HeatMapScreen';
import ReportScreen from '../screens/analytics/ReportScreen';
import MonthlyReportScreen from '@/screens/analytics/MonthlyReportScreen';
import WeeklyReportScreen from '../screens/analytics/WeeklyReportScreen';
// Import other analytics screens...

export type AnalyticsStackParamList = {
  Dashboard: { farmId: string };
  Heatmap: { farmId: string };
  Report: { farmId: string };
  MonthlyReport: { farmId: string; year?: number; month?: number };
  WeeklyReport: { farmId: string; week?: number; year?: number }; // ✅ Add this
  Trends: { farmId: string };
  Alerts: { farmId: string };
  Recommendations: { farmId: string };
  FarmComparison: undefined;
};

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

const AnalyticsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={AnalyticsDashboardScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name="Heatmap"
        component={HeatMapScreen}
        options={{ title: 'Heatmap' }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Reports' }}
      />
      <Stack.Screen
        name="WeeklyReport"
        component={WeeklyReportScreen}
        options={{ title: 'Weekly Report' }}
      />
      <Stack.Screen
        name="MonthlyReport"
        component={MonthlyReportScreen}
        options={{ title: 'Monthly Report' }}
      />
      {/* Add other screens */}
    </Stack.Navigator>
  );
};

export default AnalyticsNavigator;