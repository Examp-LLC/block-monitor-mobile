import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { auth } from '../../modules/auth/store/reducer';
import { priceApi } from '../../modules/price-api/store/reducer';
import { inAppPurchaseApi } from '../../modules/iap/store/reducer';
import { app } from './app/reducer';
import { initialState } from './initialState';

const rootReducer = combineReducers({
  app,
  auth,
  priceApi,
  inAppPurchaseApi,
});

export const getStore = (): Store => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};
