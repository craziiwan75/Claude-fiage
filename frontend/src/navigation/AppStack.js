import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import EmployeeListScreen   from '../screens/EmployeeListScreen';
import EmployeeDetailScreen from '../screens/EmployeeDetailScreen';
import EmployeeFormScreen   from '../screens/EmployeeFormScreen';
import CategoryListScreen   from '../screens/CategoryListScreen';
import DeviceListScreen     from '../screens/DeviceListScreen';
import DeviceFormScreen     from '../screens/DeviceFormScreen';
import ProfileScreen        from '../screens/ProfileScreen';

import { theme } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EmployeesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: theme.bg },
      headerShadowVisible: false,
      headerTintColor: theme.text,
    }}>
      <Stack.Screen name="EmployeeList"   component={EmployeeListScreen}   options={{ title: '员工' }} />
      <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} options={{ title: '员工详情' }} />
      <Stack.Screen name="EmployeeForm"   component={EmployeeFormScreen}   options={{ title: '员工表单' }} />
    </Stack.Navigator>
  );
}

function DevicesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: theme.bg },
      headerShadowVisible: false,
      headerTintColor: theme.text,
    }}>
      <Stack.Screen name="CategoryList" component={CategoryListScreen} options={{ title: '设备分类' }} />
      <Stack.Screen name="DeviceList"   component={DeviceListScreen}   options={({ route }) => ({ title: route.params?.categoryName || '设备' })} />
      <Stack.Screen name="DeviceForm"   component={DeviceFormScreen}   options={{ title: '设备表单' }} />
    </Stack.Navigator>
  );
}

const tabIcon = (label) => ({ focused }) => (
  <Text style={{ fontSize: 11, fontWeight: focused ? '700' : '500', color: focused ? theme.primary : theme.text3 }}>{label}</Text>
);

export default function AppStack() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 64, paddingBottom: 6 },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.text3,
    }}>
      <Tab.Screen name="Employees" component={EmployeesStack} options={{ tabBarIcon: tabIcon('员工') }} />
      <Tab.Screen name="Devices"   component={DevicesStack}   options={{ tabBarIcon: tabIcon('设备') }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}  options={{ tabBarIcon: tabIcon('我的') }} />
    </Tab.Navigator>
  );
}
