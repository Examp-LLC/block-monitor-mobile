import { BurstService } from '@burstjs/core';
import { defaultSettings } from '../../environment';
import { AppSettings, BurstSettings, Reducer } from '../../interfaces';
import { createReducers } from '../../utils/store';
import { actionTypes } from './actionTypes';
import { i18n } from '../../i18n';

export interface AppReduxState {
  isAppLoaded: boolean;
  appSettings: AppSettings;
  burstService: BurstService;
}

export function getDefaultAppSettings (): AppSettings {
  return {
    passcodeTime: defaultSettings.passcodeTime, // 10 min,
    burstSettings: getDefaultBurstSettings(),
    coinMarketCapURL: defaultSettings.coinMarketCapURL,
    blockMonitorURL: defaultSettings.blockMonitorURL,
    currentLanguage: i18n.currentLocale()
  };
}

export function getDefaultBurstSettings (): BurstSettings {
  const { nodeHost, apiRootUrl } = defaultSettings;

  return {
    nodeHost,
    apiRootUrl
  };
}

export const appState = (): AppReduxState => {
  const appSettings = getDefaultAppSettings();

  return {
    isAppLoaded: false,
    appSettings,
    burstService: new BurstService(appSettings.burstSettings)
  };
};

const appLoaded: Reducer<AppReduxState, undefined> = (state) => {
  return {
    ...state,
    isAppLoaded: true
  };
};

const appSettingsLoaded: Reducer<AppReduxState, AppSettings> = (state, action) => {
  return {
    ...state,
    appSettings: {
      ...action.payload
    }
  };
};

const setAppSettings: Reducer<AppReduxState, AppSettings> = (state, action) => {
  return {
    ...state,
    appSettings: action.payload
  };
};

const setLanguage: Reducer<AppReduxState, string> = (state, action) => {
  return {
    ...state,
    appSettings: {
      ...state.appSettings,
      currentLanguage: action.payload
    }
  };
};

const reducers = {
  [actionTypes.appLoaded]: appLoaded,
  [actionTypes.appSettingsLoaded]: appSettingsLoaded,
  [actionTypes.setAppSettings]: setAppSettings,
  [actionTypes.setLanguage]: setLanguage
};

export const app = createReducers<AppReduxState>(appState(), reducers);
