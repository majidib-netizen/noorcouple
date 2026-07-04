// ─── App.js ──────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import HomeScreen from './screens/HomeScreen';
import FichesScreen from './screens/FichesScreen';
import FicheDetailScreen from './screens/FicheDetailScreen';
import DefisScreen from './screens/DefisScreen';
import MonPlanScreen from './screens/MonPlanScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ConnexionScreen from './screens/ConnexionScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import ModeCriseScreen from './screens/ModeCriseScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import PaywallScreen from './screens/PaywallScreen';

import { COLORS } from './constants/theme';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { supabase } from './config/supabase';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { appGoMain, appReset } from './utils/appState';
export { appGoMain, appReset };

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function SplashScreenView() {
  return (
    <View style={splashStyles.container}>
      <Image source={require('./assets/logo.png')} style={splashStyles.logo} />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 240, height: 120, resizeMode: 'contain' },
});

function MainTabs({ initialTab = 'Accueil' }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Accueil') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Mon Plan') iconName = focused ? 'compass' : 'compass-outline';
          else if (route.name === 'Discutons') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ tabBarLabel: t('nav.accueil') }} />
      <Tab.Screen name="Mon Plan" component={MonPlanScreen} options={{ tabBarLabel: t('nav.plan') }} />
      <Tab.Screen name="Discutons" component={QuestionsScreen} options={{ tabBarLabel: t('nav.questions') }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarLabel: t('nav.profil') }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appState, setAppState] = useState('splash');
  const [initialTab, setInitialTab] = useState('Accueil');
  appReset.onReset = () => setAppState('onboarding');
  appGoMain.onGoMain = () => setAppState('main');

  useEffect(() => {
    const init = async () => {
      try {
        // Vérifie d'abord la session Supabase active
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Session active — connecte directement
          await AsyncStorage.setItem('onboarded', 'true');
          await AsyncStorage.setItem('user_email', session.user.email || '');

          // Récupère le profil
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('prenom, genre, app_payee')
              .eq('id', session.user.id)
              .single();
            if (profile?.prenom) await AsyncStorage.setItem('prenom', profile.prenom);
            if (profile?.genre) await AsyncStorage.setItem('genre', profile.genre);
            if (profile?.app_payee) await AsyncStorage.setItem('app_payee', 'true');
          } catch (e) {
            console.log('Profil non trouvé:', e);
          }

          try {
            const duoCode = await AsyncStorage.getItem('duo_code') || await AsyncStorage.getItem('duo_code_conjoint');
            if (duoCode) {
              const { data: duoData } = await supabase.from('duos').select('paiement_valide').eq('code', duoCode).single();
              if (duoData?.paiement_valide) {
                await AsyncStorage.setItem('duo_partenaire_paye', 'true');
              } else {
                await AsyncStorage.removeItem('duo_partenaire_paye');
              }
            }
          } catch (_) {}

          setAppState('main');
          return;
        }

        // Pas de session — vérifie AsyncStorage
        const value = await AsyncStorage.getItem('onboarded');
        if (value === 'true') {
          setAppState('main');
        } else {
          setAppState('onboarding');
        }
      } catch (e) {
        console.log('Init error:', e);
        setAppState('onboarding');
      }
    };

    init();
  }, []);

  const handleOnDone = (target) => {
    try {
      if (target === 'plan') {
        setInitialTab('Mon Plan');
        setAppState('main');
      } else if (target === 'questions') {
        setInitialTab('Discutons');
        setAppState('main');
      } else if (target === 'connexion') {
        setAppState('connexion');
      } else {
        setInitialTab('Accueil');
        setAppState('main');
      }
    } catch (e) { console.log('Erreur gestion onDone App.js:', e); }
  };

  if (appState === 'splash') {
    return <SplashScreenView />;
  }

  if (appState === 'connexion') {
    return (
      <SafeAreaProvider>
        <LanguageProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Connexion">
                {(props) => (
                  <ConnexionScreen
                    {...props}
                    onDone={() => setAppState('main')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Inscription" component={InscriptionScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {appState === 'onboarding' ? (
              <>
                <Stack.Screen name="Onboarding">
                  {(props) => <OnboardingScreen {...props} onDone={handleOnDone} />}
                </Stack.Screen>
                <Stack.Screen name="Connexion">
                  {(props) => (
                    <ConnexionScreen
                      {...props}
                      onDone={() => {
                        appGoMain.onGoMain?.();
                      }}
                    />
                  )}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="Main">
                  {() => <MainTabs initialTab={initialTab} />}
                </Stack.Screen>
                <Stack.Screen name="FicheDetail" component={FicheDetailScreen}
                  options={{ headerShown: true, headerTitle: '', headerBackTitle: 'Retour',
                    headerTintColor: COLORS.primary, headerStyle: { backgroundColor: COLORS.background } }}
                />
                <Stack.Screen name="ModeCrise" component={ModeCriseScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Défis" component={DefisScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Fiches" component={FichesScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="Paywall" component={PaywallScreen}
                  options={{ headerShown: false, presentation: 'modal' }}
                />
                <Stack.Screen name="Connexion" options={{ headerShown: false }}>
                  {(props) => (
                    <ConnexionScreen
                      {...props}
                      onDone={() => {
                        props.navigation.reset({
                          index: 0,
                          routes: [{ name: 'Main' }],
                        });
                      }}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Inscription" component={InscriptionScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
