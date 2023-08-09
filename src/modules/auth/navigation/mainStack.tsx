import * as React from 'react';
import { defaultStackOptions } from '../../../core/navigation/defaultStackOptions';
import { routes } from '../../../core/navigation/routes';
import { HomeScreen } from '../../home/screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AddAccountScreenOne } from '../screens/AddAccountScreenOne';
import { AddAccountScreenTwo } from '../screens/AddAccountScreenTwo';
import { NotificationConfigScreen } from '../screens/NotificationConfigScreen';

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.home}
      screenOptions={defaultStackOptions}
    >
      <Stack.Screen
        name={routes.home}
        component={HomeScreen}
      />
      <Stack.Screen
        name={routes.addAccountStepOne}
        component={AddAccountScreenOne}
      />
      <Stack.Screen
        name={routes.addAccountStepTwo}
        component={AddAccountScreenTwo}
      />
      <Stack.Screen
        name={routes.notificationConfig}
        component={NotificationConfigScreen}
      />
    </Stack.Navigator>
  )
};