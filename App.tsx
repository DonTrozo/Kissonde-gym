import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
import {
  AccessScreen,
  AdminDashboardScreen,
  ChallengesScreen,
  ClassesScreen,
  ExerciseDetailScreen,
  HomeScreen,
  IntegrationsScreen,
  LoginScreen,
  MembershipScreen,
  NotificationsScreen,
  OnboardingScreen,
  PrivacyScreen,
  ProfileScreen,
  RewardsScreen,
  SupportScreen,
  TrainScreen,
  WorkoutHistoryScreen,
} from './src/screens/index';

function installWebInputBoxModelFix() {
  if (Platform.OS !== 'web') return;
  const doc = (globalThis as any).document;
  if (!doc || doc.getElementById('kissonde-input-box-model')) return;
  const style = doc.createElement('style');
  style.id = 'kissonde-input-box-model';
  style.textContent = `
    input, textarea { box-sizing: border-box !important; min-width: 0 !important; max-width: 100% !important; }
    input[inputmode="decimal"], input[inputmode="numeric"] {
      width: 100% !important; max-width: 100% !important; min-width: 0 !important;
      padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;
      text-align: center !important; overflow: hidden !important; text-overflow: clip !important;
    }
  `;
  doc.head.appendChild(style);
}

installWebInputBoxModelFix();

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
    tabBarItemStyle: styles.tabItem,
    tabBarActiveBackgroundColor: colors.accentSoft,
    tabBarActiveTintColor: colors.accentDark,
    tabBarInactiveTintColor: colors.slateDark,
    tabBarLabelStyle: styles.tabLabel,
    tabBarIcon: ({ color }) => <Ionicons name={tabIcons[route.name] ?? 'ellipse'} size={19} color={color} />,
  })}>
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Acesso" component={AccessScreen} />
    <Tab.Screen name="Treinar" component={TrainScreen} />
    <Tab.Screen name="Aulas" component={ClassesScreen} />
    <Tab.Screen name="Prémios" component={RewardsScreen} />
  </Tab.Navigator>;
}

function RootNavigation() {
  const { signedIn, hydrated, onboardingComplete } = useAppState();
  if (!hydrated) return <View style={styles.splash}><BrandLogo width={196} /></View>;
  if (!signedIn) return <LoginScreen />;
  if (!onboardingComplete) return <OnboardingScreen />;

  return <NavigationContainer theme={navigationTheme}>
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.panel }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '900' }, contentStyle: { backgroundColor: colors.bg }, headerShadowVisible: false }}>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Ajuda' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificações' }} />
      <Stack.Screen name="Integrations" component={IntegrationsScreen} options={{ title: 'Apps e dispositivos' }} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Desafios' }} />
      <Stack.Screen name="Membership" component={MembershipScreen} options={{ title: 'Adesão' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacidade' }} />
      <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} options={{ title: 'Histórico de treino' }} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Exercício' }} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Kissonde Gestão' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}

export default function App() {
  return <ErrorBoundary><SafeAreaProvider><StateProvider><StatusBar style="dark" backgroundColor={colors.bg} /><RootNavigation /></StateProvider></SafeAreaProvider></ErrorBoundary>;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  tabBar: { height: 68, paddingHorizontal: 7, paddingTop: 6, paddingBottom: 7, backgroundColor: colors.panel, borderTopWidth: 1, borderTopColor: '#E1E8EE', shadowColor: '#173F5E', shadowOpacity: .08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 6 },
  tabItem: { borderRadius: 14, marginHorizontal: 2, paddingVertical: 1 },
  tabLabel: { fontSize: 10, lineHeight: 13, fontWeight: '800', marginTop: 0 },
});
