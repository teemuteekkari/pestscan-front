// src/navigation/DashboardNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { CreateFarmScreen } from '../screens/farm/CreateFarmScreen';
import { EditFarmScreen } from '../screens/farm/EditFarmScreen';
import FarmListScreen from '../screens/farm/FarmListScreen';
import FarmDetailScreen from '../screens/farm/FarmDetailScreen';
import { CreateFieldBlockScreen } from '../screens/farm/CreateFieldBlockScreen';
import { FieldBlockListScreen } from '../screens/farm/FieldBlockListScreen';
import { CreateGreenhouseScreen } from '../screens/farm/CreateGreenhouseScreen';
import { GreenhouseListScreen } from '../screens/farm/GreenhouseListScreen';

export type DashboardStackParamList = {
  Dashboard: undefined;
  FarmList: undefined;
  FarmDetail: { farmId: string };
  CreateFarm: undefined;
  EditFarm: { farmId: string };
  CreateFieldBlock: { farmId: string };
  CreateGreenhouse: { farmId: string };
  FieldBlockList: { farmId: string };
  GreenhouseList: { farmId: string };
};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="FarmList"
        component={FarmListScreen}
        options={{ title: 'Farms' }}
      />
      <Stack.Screen
        name="FarmDetail"
        component={FarmDetailScreen}
        options={{ title: 'Farm Details' }}
      />
      <Stack.Screen
        name="CreateFarm"
        component={CreateFarmScreen}
        options={{ title: 'Create Farm' }}
      />
      <Stack.Screen
        name="EditFarm"
        component={EditFarmScreen}
        options={{ title: 'Edit Farm' }}
      />
      <Stack.Screen
        name="CreateFieldBlock"
        component={CreateFieldBlockScreen}
        options={{ title: 'Create Field Block' }}
      />
      <Stack.Screen
        name="FieldBlockList"
        component={FieldBlockListScreen}
        options={{ title: 'Field Blocks' }}
      />
      <Stack.Screen 
        name="CreateGreenhouse"
        component={CreateGreenhouseScreen}
        options={{ title: 'Create Greenhouse' }}
      />
      <Stack.Screen
        name="GreenhouseList"
        component={GreenhouseListScreen}
        options={{ title: 'Greenhouses' }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;