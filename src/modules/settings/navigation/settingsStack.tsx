import * as React from 'react';
import { defaultStackOptions } from '../../../core/navigation/defaultStackOptions';
import { routes } from '../../../core/navigation/routes';
import { SettingsScreen } from '../screens/SettingsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { CreditsScreen } from '../screens/CreditsScreen';

const Stack = createStackNavigator();

export const settingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.settings}
      screenOptions={defaultStackOptions}
    >
      <Stack.Screen
        name={routes.settings}
        component={SettingsScreen}
      />
      <Stack.Screen
        name={routes.credits}
        component={CreditsScreen}
      />
    </Stack.Navigator>
  )
};


