import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNavBar({ navigation, activeRoute }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const tabs = [
    { name: 'Accueil',   icon: 'home-outline',      iconActive: 'home',      label: t('nav.accueil') },
    { name: 'Mon Plan',  icon: 'compass-outline',   iconActive: 'compass',   label: t('nav.plan') },
    { name: 'Discutons', icon: 'chatbubble-outline', iconActive: 'chatbubble', label: t('nav.questions') },
    { name: 'Profil',    icon: 'person-outline',    iconActive: 'person',    label: t('nav.profil') },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4, height: 60 + insets.bottom }]}>
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate('Main', { screen: tab.name })}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.textLight}
            />
            <Text style={[styles.label, { color: isActive ? COLORS.primary : COLORS.textLight }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E4DDD4',
    paddingTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
