import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BrandLogo } from './src/brand';
import { ErrorBoundary } from './src/ErrorBoundary';
import { colors } from './src/theme';
import { StateProvider, useAppState } from './src/state';
import { AccessScreen, ClassesScreen, HomeScreen, LoginScreen, ProfileScreen, RewardsScreen, SupportScreen, TrainScreen } from './src/screens/index';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.panel,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};

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
    tabBarHideOnKeyboard: true,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.slate,
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
  const { signedIn, hydrated } = useAppState();
  if (!hydrated) return <View style={styles.splash}><BrandLogo width={210} /></View>;
  if (!signedIn) return <LoginScreen />;

  return <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.panel },
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
  return <ErrorBoundary>
    <SafeAreaProvider>
      <StateProvider>
        <StatusBar style="dark" backgroundColor={colors.bg} />
        <RootNavigation />
      </StateProvider>
    </SafeAreaProvider>
  </ErrorBoundary>;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  tabBar: {
    position: 'absolute',
    height: 78,
    paddingTop: 9,
    paddingBottom: 10,
    backgroundColor: '#FFFFFFF2',
    borderTopColor: colors.border,
  },
  tabLabel: { fontSize: 11, fontWeight: '700' },
});
