import { createAction, createActionFn } from '../../../core/utils/store';
import { actionTypes } from './actionTypes';
import * as RNIap from 'react-native-iap';
import { Platform, Alert } from 'react-native';
import { IAP_TIERS } from '../components/purchase/PurchaseModal';
import { i18n } from '../../../core/i18n';
import { iap } from '../translations';
import { defaultSettings } from '../../../core/environment';
import { isIOS } from '../../../core/utils/platform';
import { save, load } from '../../../core/utils/storage';
import { AsyncStorageKeys } from '../../../core/enums';
import { SUBS_ENABLED } from '../../../../../shared/constants';
import { InAppPurchaseReduxState } from './reducer';
import { AuthReduxState } from '../../auth/store/reducer';
import { subscribeAllAccounts } from '../../auth/store/actions';

const actions = {
  loadSubscriptions: createAction<RNIap.Subscription[]>(actionTypes.loadSubscriptions),
  failedToLoadSubscriptions: createAction<void>(actionTypes.failedToLoadSubscriptions),
  failedToReloadPurchases: createAction<void>(actionTypes.failedToReloadPurchases),
  makePurchase: createAction<void>(actionTypes.makePurchase),
  addPurchase: createAction<ServerSubscriptionResponse>(actionTypes.addPurchase),
  saveReceipt: createAction<RNIap.SubscriptionPurchase>(actionTypes.saveReceipt),
  loadPurchases: createAction<ServerSubscriptionResponse[] | undefined>(actionTypes.loadPurchases),
};

// const apiHostUrl = 'http://10.0.2.2:3001'; // android emulator
// const apiHostUrl = 'http://localhost:3001';
// const apiHostUrl = 'http://192.168.1.32:3001'; // physical apple device via xcode and android device
const apiHostUrl = defaultSettings.blockMonitorURL;

export const loadSubscriptions = createActionFn<void, Promise<RNIap.Subscription[]>>(
  // @ts-ignore
  async (dispatch, _getState) => {
    const skus = Object.values(IAP_TIERS);
    const itemSkus = Platform.select({
      default: [
        ...skus
      ]
    });
    if (itemSkus) {
      try {
        const subs: RNIap.Subscription[] = await RNIap.getSubscriptions(itemSkus);
        dispatch(actions.loadSubscriptions(subs));
      } catch(err) {
        console.warn(err); // standardized err.code and err.message available
        dispatch(actions.failedToLoadSubscriptions());
      }
    }
  }
);

export const loadPurchasesFromAsyncStorage = createActionFn<void, Promise<ServerSubscriptionResponse[]>>(
  // @ts-ignore
  async (dispatch, _getState) => {
    const purchases = await load<ServerSubscriptionResponse[]>(AsyncStorageKeys.purchases);
    dispatch(actions.loadPurchases(purchases));
  }
);

export const addPurchase = createActionFn<ServerSubscriptionResponse, Promise<void>>(
  async (dispatch, getState, payload) => {
    dispatch(actions.addPurchase(payload))
    await save(AsyncStorageKeys.purchases, getState().inAppPurchaseApi.purchases || []);
  }
)

export const makePurchase = createActionFn<IAP_TIERS, Promise<void>>(
  async (_dispatch, _getState, payload) => {
    try {
      await RNIap.requestSubscription(payload, false);
    } catch (e) {
      console.warn(e);
    }
  }
)

export const userHasSubscription = (inAppPurchaseApi: InAppPurchaseReduxState, auth: AuthReduxState) => {
  let userHasSubscription = false;
  if (SUBS_ENABLED && inAppPurchaseApi.purchases?.length) {
    userHasSubscription = inAppPurchaseApi.purchases.findIndex((purchase) => {
      return purchase.hasSubscription;
    }) > -1

  } else if (!SUBS_ENABLED) {
    userHasSubscription = true;
  }

  // Allow list case - hide modal if user is on allowList
  if (auth.userIsOnAllowList) {
    userHasSubscription = true;
  }

  return userHasSubscription;

}


export const loadPurchasesFromServer = createActionFn<void, void>(
  async (dispatch, getState) => {

    const { userId } = getState().auth;
    const response = await fetch(`${apiHostUrl}/api/v1/subscriptions/user/${userId}/${isIOS ? 'ios' : 'android'}`);

    if (response.ok) {
      const resJson = await response.json() as ServerSubscriptionResponse[];
      dispatch(actions.loadPurchases(resJson));
    } else {
      dispatch(actions.failedToReloadPurchases());
      // throw new Error(i18n.t(iap.errors.serverErrorFetchingReceipts));
    }
  }
);

export const validatePromoCode = createActionFn<string, void>(
  async (dispatch, getState, promoCode) => {
    const { userId, deviceId } = getState().auth;

    const response = await fetch(`${apiHostUrl}/api/v1/allowlist/validatePromoCode`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        deviceId,
        promoCode
      })
    });

    const valid = await response.json();

    if (response.ok && valid) {
      dispatch(subscribeAllAccounts());
      Alert.alert('Promo code accepted');
    } else {
      Alert.alert('Invalid promo code');
    }
  }
);

export const restorePurchses = createActionFn<void, void>(
  async (dispatch, _getState) => {

    try {
      const purchases = await RNIap.getAvailablePurchases();

      const txIds = [...new Set(purchases.map(purchase => {
        return purchase.originalTransactionIdentifierIOS || purchase.transactionId;
      }))];


      const result = await Promise.all(txIds.map((id) => fetch(`${apiHostUrl}/api/v1/subscriptions/id/${id}`)))
      if (result && result.length) {
        result.forEach(async (response) => {
          if (response.ok) {
            const resJson = await response.json();
            if (resJson.subscription) {
              dispatch(actions.addPurchase(resJson));
            }
          }
        })
      }

      Alert.alert('Restore Successful');
    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
      // @ts-ignore
      Alert.alert(err.message);
    }

  }
);

export const saveReceipt = createActionFn<RNIap.SubscriptionPurchase, Promise<ServerSubscription>>(
  async (_dispatch, getState, purchase): Promise<ServerSubscription> => {

    const { userId, accounts } = getState().auth;
    const response = await fetch(`${apiHostUrl}/api/v1/subscriptions/save-receipt/${userId}`,
    {
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        purchase,
        appType: isIOS ? 'ios' : 'android',
        accounts
      })
    });

    if (response.ok) {
      const resJson = await response.json();
      return resJson;
    } else {
      throw new Error(i18n.t(iap.errors.serverErrorSavingReceipt));
    }

  }
);

// from API
export interface ServerSubscription {
  app: string; 
  environment: string; 
  origTxId: string; 
  userId: string; 
  validationResponse?: string; 
  latestReceipt?: string; 
  startDate: Date;
  endDate?: string; 
  productId: string; 
  isCancelled: string;
  isExpired: string;
}

export interface ServerSubscriptionResponse {
  hasSubscription: boolean;
  subscription: ServerSubscription
}

