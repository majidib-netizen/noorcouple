import { Platform } from 'react-native';

export const APP_STORE_URLS = {
  ios: 'https://apps.apple.com/app/id6771410249',
  android: 'https://play.google.com/store/apps/details?id=com.casquedev.noorcouple',
};

export const getAppStoreUrl = () =>
  Platform.OS === 'ios' ? APP_STORE_URLS.ios : APP_STORE_URLS.android;
