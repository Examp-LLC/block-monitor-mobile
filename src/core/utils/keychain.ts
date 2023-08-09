import * as Keychain from 'react-native-keychain';
import TouchID, { AuthenticationError } from 'react-native-touch-id';
import { KeyChainKeys } from '../enums';
import { AppSettings, KeychainCredentials, TouchIDOptionalConfig } from '../interfaces';
import { getDefaultAppSettings } from '../store/app/reducer';

export function setCredentials ({ username, password }: KeychainCredentials, service?: string): Promise<boolean | Keychain.Result> {
  return Keychain.setGenericPassword(
    username,
    password,
    { service, accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK }
  );
}

export function getCredentials (service?: string)
  : Promise<boolean | KeychainCredentials> {
  return Keychain.getGenericPassword({ service });
}

export function authWithTouchId (reason: string, optionalConfig?: TouchIDOptionalConfig)
  : Promise<boolean | AuthenticationError> {
  const config: TouchIDOptionalConfig = {
    passcodeFallback: false,
    ...optionalConfig
  };
  return TouchID.authenticate(reason, config);
}

export function isTouchIDSupported (): Promise<boolean> {
  return TouchID.isSupported().then(() => true).catch(() => false);
}

export function saveAppSettings (settings: AppSettings): Promise<boolean | Keychain.Result> {
  // TODO: refactor get/setCredentials
  return setCredentials({ username: KeyChainKeys.settings, password: JSON.stringify(settings) });
}

export async function getAppSettings (): Promise<AppSettings> {
  const credentials: KeychainCredentials = await getCredentials(KeyChainKeys.accounts) as KeychainCredentials;
  if (credentials && credentials.password) {
    return {
      ...getDefaultAppSettings(),
      ...JSON.parse(credentials.password)
    };
  } else {
    return getDefaultAppSettings();
  }
}
