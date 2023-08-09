import { loadAccounts,
  loadAgreeToTerms,
  loadPasscode,
  loadPasscodeEnteredTime,
  loadDeviceId,
  loadUserId,
  fetchAllowListForUserId
} from '../../../modules/auth/store/actions';
import { fetchBurstTokenInformation, fetchTokenInformation, loadHistoricalPriceApiData } from '../../../modules/price-api/store/actions';
import { loadSubscriptions, loadPurchasesFromAsyncStorage, loadPurchasesFromServer } from '../../../modules/iap/store/actions';
import { AppSettings } from '../../interfaces';
import { getAppSettings, saveAppSettings } from '../../utils/keychain';
import { createAction, createActionFn } from '../../utils/store';
import { actionTypes } from './actionTypes';
import { AsyncStorageKeys } from '../../enums';
import { getCurrentLanguage } from './utils';
import { i18n } from '../../i18n';
import { I18nManager } from 'react-native';
import { save } from '../../utils/storage';

const actions = {
  appLoaded: createAction<void>(actionTypes.appLoaded),
  appSettingsLoaded: createAction<AppSettings>(actionTypes.appSettingsLoaded),
  setAppSettings: createAction<AppSettings>(actionTypes.setAppSettings),
  setLanguage: createAction<string>(actionTypes.setLanguage)
};

export const loadApp = createActionFn<void, Promise<void>>(
  async (dispatch) => {
    await Promise.all([
      dispatch(loadAccounts()),
      dispatch(loadPasscode()),
      dispatch(loadPasscodeEnteredTime()),
      dispatch(loadAppSettings()),
      dispatch(loadAgreeToTerms()),
      dispatch(loadDeviceId()),
      dispatch(loadUserId()),
      dispatch(loadPurchasesFromAsyncStorage()),
      dispatch(loadHistoricalPriceApiData())
    ]);
    dispatch(loadCurrentLanguage());
    dispatch(fetchTokenInformation());
    dispatch(loadSubscriptions());
    dispatch(loadPurchasesFromServer());
    dispatch(fetchBurstTokenInformation());
    dispatch(fetchAllowListForUserId());
    dispatch(actions.appLoaded());
  }
);

export const loadAppSettings = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const settings: AppSettings = await getAppSettings();
    dispatch(actions.appSettingsLoaded(settings));
  }
);

export const setAppSettings = createActionFn<AppSettings, Promise<void>>(
  async (dispatch, _getState, settings) => {
    dispatch(actions.setAppSettings(settings));
    await saveAppSettings(settings);
  }
);

export const saveLanguage = createActionFn<string, Promise<void>>(
  async (dispatch, _getState, language) => {
    try {
      setLanguage(language);
      await save(AsyncStorageKeys.currentLanguage, language);
    } catch (error) {
      // Error saving data
    }
    dispatch(actions.setLanguage(language));
  }
);

export const loadCurrentLanguage = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const language = await getCurrentLanguage();
    setLanguage(language);
    dispatch(actions.setLanguage(language));
  }
);
  
const setLanguage = (lang: string) => {
  if (lang === "ar") {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  i18n.locale = lang;
}

