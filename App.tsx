import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme';
import { StateProvider, useAppState } from './src/state';
import { AccessScreen, ClassesScreen, HomeScreen, LoginScreen, ProfileScreen, RewardsScreen, SupportScreen, TrainScreen } from './src/screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Início': 'home',
  'Acesso': 'qr-code',
  'Treinar': 'barbell',
  'Aulas': 'calendar',
  'Prémios': 'gift',
};

function MainTabs() {
  return <Tab.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: styles.tabLabel,
    tabBarIcon: ({ color, size }) => <Ionicons name={tabIcons[route.name] ?? 'ellipse'} size={size} color={color} />,
  })}>
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Acesso" component={AccessScreen} />
    <Tab.Screen name="Treinar" component={TrainScreen} />
    <Tab.Screen name="Aulas" component={ClassesScreen} />
    <Tab.Screen name="Prémios" component={RewardsScreen} />
  </Tab.Navigator>;
}

function RootNavigation() {
  const { signedIn } = useAppState();
  if (!signedIn) return <LoginScreen />;
  return <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.bg },
      headerTintColor: colors.text,
      contentStyle: { backgroundColor: colors.bg },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Ajuda' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}

export default function App() {
  return <SafeAreaProvider>
    <StateProvider>
      <StatusBar style="light" />
      <RootNavigation />
    </StateProvider>
  </SafeAreaProvider>;
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 76,
    paddingTop: 9,
    paddingBottom: 10,
    backgroundColor: '#111114F2',
    borderTopColor: colors.border,
  },
  tabLabel: { fontSize: 10, fontWeight: '700' },
});
