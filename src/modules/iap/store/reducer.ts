import { Reducer } from '../../../core/interfaces';
import { createReducers } from '../../../core/utils/store';
import { actionTypes } from './actionTypes';
import { Subscription } from 'react-native-iap';
import { ServerSubscription, ServerSubscriptionResponse } from './actions';

export interface InAppPurchaseReduxState {
  purchases?: ServerSubscriptionResponse[];
  availableSubscriptions?: Subscription[];
}

export const inAppPurchaseApiState = (): InAppPurchaseReduxState => {
  return {};
};

const failedToReloadInAppPurchases: Reducer<InAppPurchaseReduxState, void> = (state) => {
  return {
    ...state,
    purchases: undefined
  };
};

const addPurchase: Reducer<InAppPurchaseReduxState, ServerSubscriptionResponse> = (state, action) => {
  const purchase = action.payload;
  return {
    ...state,
    purchases: [...state.purchases || [], purchase]
  };
};

const failedToLoadSubscriptions: Reducer<InAppPurchaseReduxState, void> = (state) => {
  return {
    ...state,
    availableSubscriptions: undefined
  };
};

const loadSubscriptions: Reducer<InAppPurchaseReduxState, Subscription[]> = (state, action) => {
  const availableSubscriptions = action.payload;
  return {
    ...state,
    availableSubscriptions
  };
};

const loadPurchases: Reducer<InAppPurchaseReduxState, ServerSubscriptionResponse[]> = (state, action) => {
  const purchases = action.payload;
  return {
    ...state,
    purchases
  };
};

const reducers = {
  [actionTypes.failedToReloadPurchases]: failedToReloadInAppPurchases,
  [actionTypes.addPurchase]: addPurchase,
  [actionTypes.failedToLoadSubscriptions]: failedToLoadSubscriptions,
  [actionTypes.loadPurchases]: loadPurchases,
  [actionTypes.loadSubscriptions]: loadSubscriptions
};

export const inAppPurchaseApi = createReducers(inAppPurchaseApiState(), reducers);
