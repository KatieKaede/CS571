import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';

import { PreferencesProvider } from './contexts/BadgerContext';
import BadgerTabs from './navigation/BadgerTabs';
import CS571 from '@cs571/mobile-client';

export default function BadgerNews(props) {

  const [prefs, setPrefs] = useState({});

  return (
    <PreferencesProvider>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </PreferencesProvider>
  );
}