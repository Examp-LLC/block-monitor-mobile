import React, { Props } from 'react';
import {  View, Image, EmitterSubscription, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { i18n } from './src/core/i18n';
import { RootView } from './src/core/layout/RootView';
import { getStore } from './src/core/store/store';
import { routes } from './src/core/navigation/routes';
import { Colors } from './src/core/theme/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/modules/home/screens/HomeScreen';
import { AddAccountScreenOne } from './src/modules/auth/screens/AddAccountScreenOne';
import { SettingsScreen } from './src/modules/settings/screens/SettingsScreen';
import { AddAccountScreenTwo } from './src/modules/auth/screens/AddAccountScreenTwo';
import { createStackNavigator } from '@react-navigation/stack';
import { tabbarIcons, tabbarIconsHover } from './src/assets/icons';
import { auth } from './src/modules/auth/translations';
import { core } from './src/core/translations';
import { settings } from './src/modules/settings/translations';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase, 
  PurchaseError,
} from 'react-native-iap';
import { addPurchase, saveReceipt } from './src/modules/iap/store/actions';
import { IAP_TIERS } from './src/modules/iap/components/purchase/PurchaseModal';
import { Notifications, Notification, NotificationResponse, Registered, RegistrationError } from 'react-native-notifications';
import { CreditsScreen } from './src/modules/settings/screens/CreditsScreen';
import { ScanQRCodeScreen } from './src/modules/transactions/screens/ScanQRCodeScreen';
import { setDeviceId, loadAccounts, subscribeAllAccounts } from './src/modules/auth/store/actions';
import { NotificationConfigScreen } from './src/modules/auth/screens/NotificationConfigScreen';
import { isIOS } from './src/core/utils/platform';

const store: Store = getStore();

interface AppState {
  deviceId?: string;
}

const rootTabStackConfig = {
  initialRouteName: routes.home,
  tabBarOptions: {
    activeTintColor: Colors.BLUE,
    activeBackgroundColor: Colors.WHITE,
    inactiveTintColor: Colors.GREY,
    inactiveBackgroundColor: Colors.WHITE,
    showIcon: true,
    style: {
      backgroundColor: Colors.WHITE,
      borderTopWidth: 0
    }
  }
};

const tiers = Object.values(IAP_TIERS);

export default class App extends React.Component<{}, AppState> {

  state: AppState = {
  };

  purchaseUpdateSubscription: EmitterSubscription | null = null
  purchaseErrorSubscription: EmitterSubscription | null = null
  
  constructor(props: Props<{}>) {
    super(props);

    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered(({ deviceToken }: Registered) => {
      // @ts-ignore - f typescript
      store.dispatch(setDeviceId(deviceToken));
    });

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      completion({alert: true, sound: true, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification: NotificationResponse, completion) => {
      completion();
    });

    this.setupSubscriptionListener();
 
    this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.warn('purchaseErrorListener', error);
    });
  }

  private async setupSubscriptionListener() {

    if (isIOS) {
      RNIap.clearProductsIOS();
    }

    try {
      const result = await RNIap.initConnection();
      await RNIap.consumeAllItemsAndroid();
    } catch (err) {
      // @ts-ignore
      console.warn(err.code, err.message);
    }

    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: SubscriptionPurchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        try {
          // @ts-ignore
          const receipt = await store.dispatch(saveReceipt(purchase));
          await RNIap.finishTransaction(purchase, false);
          console.log(purchase);
          // @ts-ignore - todo: figure out this type issue
          const hasSubscription = !(purchase.isExpired || purchase.isCancelled);
          // @ts-ignore - possible bug here as well setting hasSubscription to true like this
          await store.dispatch(addPurchase({ hasSubscription, subscription: receipt }));

          if (hasSubscription) {
            // @ts-ignore
            store.dispatch(subscribeAllAccounts());
          }

          // hopefully fixes really bad account reset bug
          setTimeout(() => {
            // @ts-ignore
            store.dispatch(loadAccounts());
          }, 5000);

        } catch(e) {
          console.log(e);
          Alert.alert('There was a problem processing your subscription.');
        }
      }
    });
  }
 
  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  render () {
    const RootTabStack = createBottomTabNavigator();
    return (
      <Provider store={store}>
        <NavigationContainer>
          <RootView>
            <View />
          </RootView>
          <RootTabStack.Navigator
            tabBarOptions={rootTabStackConfig.tabBarOptions}
            initialRouteName={rootTabStackConfig.initialRouteName}>
            <RootTabStack.Screen
              options={{
                tabBarLabel: i18n.t(core?.screens?.home?.title) || '',
                tabBarIcon: ({ color, size }) => (
                  color === Colors.BLUE ? 
                  <Image source={tabbarIconsHover.home} style={{width:25, height: 25}} /> : 
                  <Image source={tabbarIcons.home} style={{width:25, height: 25}} />
                ),
              }} 
              name={routes.home} 
              component={HomeStack} 
            />
            <RootTabStack.Screen 
              options={{
                tabBarLabel: i18n.t(auth.addAccount.title),
                tabBarIcon: ({ color, size }) => (
                  <View style={{top:-10, left:5, height:60, width:60}}>
                    <Image source={tabbarIcons.add} style={{width:50, height: 50}} />
                  </View>
                ),
              }}  name={routes.addAccountStepOne} component={AddAccount} />
            <RootTabStack.Screen 
              options={{
                tabBarLabel: i18n.t(settings.screens.settings.title),
                tabBarIcon: ({ color, size }) => (
                  color === Colors.BLUE ? 
                  <Image source={tabbarIconsHover.settings} style={{width:25, height: 25}} /> : 
                  <Image source={tabbarIcons.settings} style={{width:25, height: 25}} />
                ), 
              }}  name={routes.settings} component={SettingsStack} />
          </RootTabStack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

function AddAccount() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={routes.addAccountStepOne} component={AddAccountScreenOne} />
      <Stack.Screen name={routes.addAccountStepTwo} component={AddAccountScreenTwo} />
      <Stack.Screen name={routes.scan} component={ScanQRCodeScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={routes.home} component={HomeScreen} />
      <Stack.Screen name={routes.notificationConfig} component={NotificationConfigScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={routes.settings} component={SettingsScreen} />
      <Stack.Screen name={routes.credits} options={{
        headerShown:true,
        headerStyle: {
          backgroundColor: Colors.BLUE_DARK,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }} component={CreditsScreen} />
    </Stack.Navigator>
  );
}