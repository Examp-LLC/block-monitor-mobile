import { AuthReduxState, authState } from '../../modules/auth/store/reducer';
import { priceApiState, PriceInfoReduxState } from '../../modules/price-api/store/reducer';
import { AppReduxState, appState } from './app/reducer';
import { InAppPurchaseReduxState, inAppPurchaseApiState } from '../../modules/iap/store/reducer';

export interface ApplicationState {
  app: AppReduxState
  auth: AuthReduxState,
  priceApi: PriceInfoReduxState,
  inAppPurchaseApi: InAppPurchaseReduxState
}

export const initialState: ApplicationState = {
  app: appState(),
  auth: authState(),
  priceApi: priceApiState(),
  inAppPurchaseApi: inAppPurchaseApiState()
};
