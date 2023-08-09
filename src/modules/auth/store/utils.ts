import { isEmpty } from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorageKeys, KeyChainKeys } from '../../../core/enums';
import { KeychainCredentials, Account } from '../../../core/interfaces';
import { getCredentials, setCredentials } from '../../../core/utils/keychain';
import { Result } from 'react-native-keychain';
import { load } from '../../../core/utils/storage';
import { ServerSubscriptionResponse } from '../../iap/store/actions';
import { MAX_ACCOUNTS_PER_CURRENCY, SUBS_ENABLED, CURRENCIES } from '../../../../../shared/constants';

export interface MaxAccountValues {
  total: number;
  perCurrency: number;
}

export function savePasscode (passcode: string): Promise<boolean | Result> {
  const data = JSON.stringify(passcode);
  return setCredentials({ username: KeyChainKeys.passcode, password: data }, KeyChainKeys.passcode);
}

export async function getPasscode (): Promise<string> {
  const credentials: KeychainCredentials = await getCredentials(KeyChainKeys.passcode) as KeychainCredentials;
  if (credentials && credentials.password) {
    return JSON.parse(credentials.password);
  } else {
    return '';
  }
}

export async function getAgreeToTerms (): Promise<boolean> {
  return !!load(AsyncStorageKeys.agreeToTerms);
}

export async function getDeviceId (): Promise<string | undefined> {
  return load(AsyncStorageKeys.deviceId);
}

export async function getUserId (): Promise<string | undefined> {
  return load(AsyncStorageKeys.userId);
}

export function setAccounts (accounts: Account[]): Promise<boolean | Result> {
  const accountsWithoutTransactions = accounts.map((account) => {
    return {
      ...account,
      transactions: []
    };
  });
  const data = JSON.stringify(accountsWithoutTransactions);
  return setCredentials({ username: KeyChainKeys.accounts, password: data }, KeyChainKeys.accounts);
}

export async function getAccounts (): Promise<Account[]> {
  const credentials: KeychainCredentials = await getCredentials(KeyChainKeys.accounts) as KeychainCredentials;
  if (credentials && credentials.password) {
    return JSON.parse(credentials.password);
  } else {
    return [];
  }
}

export function savePasscodeEnteredTime (time: number): Promise<boolean | Result> {
  const data = JSON.stringify(time);
  return setCredentials(
    { username: KeyChainKeys.passcodeEnteredTime, password: data },
    KeyChainKeys.passcodeEnteredTime
  );
}

export function resetKeychain (): Promise<[boolean | Result, boolean | Result]> {
  return Promise.all([
    setCredentials({ username: KeyChainKeys.passcodeEnteredTime, password: JSON.stringify(0) },
      KeyChainKeys.passcodeEnteredTime),
    setCredentials({ username: KeyChainKeys.accounts, password: JSON.stringify([]) },
      KeyChainKeys.accounts)
  ]);
}

export async function getPasscodeEnteredTime (): Promise<number> {
  const credentials: KeychainCredentials =
    await getCredentials(KeyChainKeys.passcodeEnteredTime) as KeychainCredentials;
  if (credentials && credentials.password) {
    return JSON.parse(credentials.password);
  } else {
    return 0;
  }
}

export function shouldEnterPIN (passcodeTime: number, lastTimeEntered: number): boolean {
  return lastTimeEntered + passcodeTime <= Date.now();
}

export function isPasscodeSet (passcode: string): boolean {
  return !isEmpty(passcode);
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export function getMaxAccounts(addresses: Account[] = [], 
    subscriptions: ServerSubscriptionResponse[] | undefined = [], 
    userIsOnAllowList: boolean = false): MaxAccountValues {
  let total = 100; // default: 1
  let perCurrency = MAX_ACCOUNTS_PER_CURRENCY; // default: 1

  // if (SUBS_ENABLED && addresses.length) {
  //   total = 100;
  //   perCurrency = MAX_ACCOUNTS_PER_CURRENCY;
  //   const activeSubscription = subscriptions.reverse().findIndex(({ hasSubscription }) => {
  //     return hasSubscription
  //   });
  //   if (activeSubscription !== -1) {
  //     // const productId = subscriptions[activeSubscription].subscription.productId;
  //     total = perCurrency * Object.keys(CURRENCIES).length;
  //   }
  // }

  // if (userIsOnAllowList) {
  //   perCurrency = 5;
  //   total = perCurrency * Object.keys(CURRENCIES).length
  // }
  
  return {
    total,
    perCurrency
  };
}
