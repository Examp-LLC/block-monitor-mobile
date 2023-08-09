import _, { some } from 'lodash';
import { AsyncStorageKeys } from '../../../core/enums';
import { i18n } from '../../../core/i18n';
import { createAction, createActionFn } from '../../../core/utils/store';
import { auth } from '../translations';
import { actionTypes } from './actionTypes';
import { Account, GetState, Transaction } from '../../../core/interfaces';
import {
  getAccounts,
  getAgreeToTerms,
  getPasscode,
  getPasscodeEnteredTime,
  resetKeychain,
  savePasscode,
  savePasscodeEnteredTime,
  setAccounts,
  getDeviceId,
  getUserId,
  uuidv4
} from './utils';
import { defaultSettings } from '../../../core/environment';
import { CURRENCIES, CURRENCY, CURRENCY_SYMBOL, MAX_ACCOUNTS_PRO_MONITORING, STATUS, TRIGGERS } from '../../../../../shared/constants';
import { AccountTypes } from '../../coinbase/interfaces/coinbase.interfaces';
import { save } from '../../../core/utils/storage';
import { Alert } from 'react-native';
import { getAccountTransactionsAndBalance as getBTCAccountTransactionsAndBalance } from '../../currencies/btc/btc.service';
import { getAccountTransactionsAndBalance as getIOTAAccountTransactionsAndBalance } from '../../currencies/iota/iota.service';
import { 
  getAccountTransactionsAndBalance as getETHAccountTransactionsAndBalance, 
  getEth2AccountBalance, 
  getEthTokenInfo, 
  getTokenAccountTransactionsAndBalance 
} from '../../currencies/eth/eth.service';
import { 
  getAccountTransactionsAndBalance as getMaticAccountTransactionsAndBalance, 
} from '../../currencies/matic/matic.service';
import { 
  getAccountTransactionsAndBalance as getAvaxAccountTransactionsAndBalance, 
} from '../../currencies/avax/avax.service';
import { 
  getAccountTransactionsAndBalance as getBurstAccountTransactionsAndBalance,
  getBurstTokenInfo, 
  getTokenAccountTransactionsAndBalance as getBurstTokenAccountTransactionsAndBalance 
} from '../../currencies/burst/burst.service';
import { 
  getAccountTransactionsAndBalance as getXRPAccountTransactionsAndBalance,
} from '../../currencies/xrp/xrp.service';
import { 
  getAccountTransactionsAndBalance as getCryptoIDAccountTransactionsAndBalance,
} from '../../currencies/cryptoid/cryptoid.service';
import { 
  getAccountTransactionsAndBalance as getDOGEAccountTransactionsAndBalance,
} from '../../currencies/doge/doge.service';
import { 
  getAccountTransactionsAndBalance as getFIOAccountTransactionsAndBalance,
} from '../../currencies/fio/fio.service';
import { 
  getAccountTransactionsAndBalance as getXDAIAccountTransactionsAndBalance,
} from '../../currencies/xdai/xdai.service';
import { userHasSubscription } from '../../iap/store/actions';
import { inAppPurchaseApi } from '../../iap/store/reducer';


// const apiHostUrl = 'http://10.0.2.2:3001'; // android emulator
// const apiHostUrl = 'http://localhost:3001'; // apple emulator
// const apiHostUrl = 'http://192.168.1.32:3001'; // physical apple device via xcode
// const apiHostUrl = 'http://10.0.1.5:3001';
const apiHostUrl = defaultSettings.blockMonitorURL; // default - use for builds/releases

const actions = {
  addAccount: createAction<Account>(actionTypes.addAccount),
  getAccount: createAction<string>(actionTypes.getAccount),
  updateAccount: createAction<Account>(actionTypes.updateAccount),
  removeAccount: createAction<Account>(actionTypes.removeAccount),
  loadAccounts: createAction<Account[]>(actionTypes.loadAccounts),
  loadPasscodeEnteredTime: createAction<number>(actionTypes.loadPasscodeEnteredTime),
  setPasscodeEnteredTime: createAction<number>(actionTypes.setPasscodeEnteredTime),
  setPasscode: createAction<string>(actionTypes.setPasscode),
  setAgreeToTerms: createAction<boolean>(actionTypes.setAgreeToTerms),
  setDeviceId: createAction<string | undefined>(actionTypes.setDeviceId),
  setUserId: createAction<string | undefined>(actionTypes.setUserId),
  loadPasscode: createAction<string>(actionTypes.loadPasscode),
  loadAgreeToTerms: createAction<boolean>(actionTypes.loadAgreeToTerms),
  loadDeviceId: createAction<string>(actionTypes.loadDeviceId),
  loadUserId: createAction<string>(actionTypes.loadUserId),
  resetAuthState: createAction<void>(actionTypes.resetAuthState),
  setAllowList: createAction<boolean>(actionTypes.setAllowList),
  setTrigger: createAction<SetTriggerActionPayload>(actionTypes.setTrigger)
};

export interface CreateAccountDto {
  id?: string;
  currency: CURRENCY_SYMBOL;
  address: string;
  deviceId: string;
  tokenAddress?: string;
  tokenDecimals?: string;
  isEthValidator?: boolean;
}

export interface CreateCoinbaseAccountDto {
  // currency: CURRENCY_SYMBOL;
  accessToken: string;
  accessTokenExpirationDate: string;
  idToken: string;
  refreshToken: string;
  scopes: any[];
  // tokenType: string;
  phone: string;
}

export interface CoinbaseAccount {
  id: string;
  name: string;
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
  currency: CURRENCY_SYMBOL;
  lastBalance: string;
  updatedAt: Date;
  dateCreated?: Date;
  status?: number;
  ip?: string;
  phone?: string;
  method?: number;
}

export interface SetTriggerActionPayload {
  id: string;
  trigger: TRIGGERS;
}

export interface BalanceAndTransactions {
  balance: string;
  transactions: Transaction[];
}

export const getBalanceAndTransactionsFromBlockchain = async ({ 
  address, 
  currency,
  tokenAddress,
  isEthValidator
}: CreateAccountDto) => {
  
  let transactions: Transaction[] = [];
  let balance: string = '';
  let transactionsAndBalance: BalanceAndTransactions;
  let updatedAddress: string | undefined;

  switch (currency) {

    case CURRENCIES.BTC.ticker:
      transactionsAndBalance = await getBTCAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;


    case CURRENCIES.BURST.ticker:
    case CURRENCIES.SIGNA.ticker:
      if (tokenAddress && tokenAddress.length) {
        transactionsAndBalance = await getBurstTokenAccountTransactionsAndBalance(address, tokenAddress);
        transactions = transactionsAndBalance.transactions;
        balance = transactionsAndBalance.balance;
      } else {
        transactionsAndBalance = await getBurstAccountTransactionsAndBalance(address);
        transactions = transactionsAndBalance.transactions;
        balance = transactionsAndBalance.balance;
      }
      break;


    case CURRENCIES.ETH.ticker:
      if (tokenAddress && tokenAddress.length) {
        transactionsAndBalance = await getTokenAccountTransactionsAndBalance(address, tokenAddress);
        transactions = transactionsAndBalance.transactions;
        balance = transactionsAndBalance.balance;
      } else if (isEthValidator) {
        address = address.split(',')[0];
        const eth2Balance = await getEth2AccountBalance(address);
        // replace the eth2 index with pubkey for consistency
        updatedAddress = eth2Balance.pubkey;
        balance = eth2Balance.balance.toString();
        transactions = [];
      } else {
        transactionsAndBalance= await getETHAccountTransactionsAndBalance(address);
        transactions = transactionsAndBalance.transactions;
        balance = transactionsAndBalance.balance;
      }
      break;

    case CURRENCIES.AVAX.ticker:
      transactionsAndBalance = await getAvaxAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

    case CURRENCIES.MATIC.ticker:
      transactionsAndBalance= await getMaticAccountTransactionsAndBalance(address)
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

    case CURRENCIES.XRP.ticker:
      transactionsAndBalance = await getXRPAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;


    case CURRENCIES.LTC.ticker:
    case CURRENCIES.DGB.ticker:
    case CURRENCIES.DASH.ticker:
    case CURRENCIES.DIVI.ticker:
    case CURRENCIES.STRAX.ticker:
    case CURRENCIES.SYS.ticker:
    case CURRENCIES.GRS.ticker:
      transactionsAndBalance = await getCryptoIDAccountTransactionsAndBalance(address, currency);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;


    case CURRENCIES.DOGE.ticker:
      transactionsAndBalance = await getDOGEAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

      
    case CURRENCIES.MIOTA.ticker:
      transactionsAndBalance = await getIOTAAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

      
    case CURRENCIES.FIO.ticker:
      transactionsAndBalance = await getFIOAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

      
    case CURRENCIES.XDAI.ticker:
      transactionsAndBalance = await getXDAIAccountTransactionsAndBalance(address);
      transactions = transactionsAndBalance.transactions;
      balance = transactionsAndBalance.balance;
      break;

  }
  return { transactions, balance, updatedAddress };
}


export const createAccountOnDevice = createActionFn<CreateAccountDto, Promise<Account>>(

  async (
    dispatch, 
    getState, 
    createAccountDTO: CreateAccountDto): Promise<Account> => {
      const account = await createAccountForDevice(createAccountDTO);

      if (userHasSubscription(getState().inAppPurchaseApi, getState().auth)) {
        const deviceId = getState().auth.deviceId;
        if (deviceId) {
          await dispatch(createAccountOnServer({ ...account, deviceId }));
        } else {
          throw new Error('Please enable push notifications');
        }
      }
      return account;
  }
)


export const createAccountOnServer = createActionFn<CreateAccountDto, Promise<Account>>(

  async (_dispatch, getState, { id, currency, address, tokenAddress, deviceId, tokenDecimals, isEthValidator }: CreateAccountDto): Promise<Account> => {

    // const hasAccount = some(getState().auth.accounts, (item) => item.address === address);

    let tokenName, tokenSymbol;

    // if (hasAccount) {
    //   throw new Error(i18n.t(auth.errors.accountExist));
    // }

    // fetch token name and divisor for future push notifications
    if (tokenAddress && currency === 'ETH') {
      ({ tokenName, tokenSymbol } = await getEthTokenInfo(tokenAddress));
    } else if (tokenAddress && currency === 'SIGNA') {
      ({ tokenName, tokenSymbol, tokenDecimals } = await getBurstTokenInfo(tokenAddress, tokenName, tokenSymbol, tokenDecimals));
    }

    if (isEthValidator) {
      tokenDecimals = "9";
    }

    const response = await fetch(`${apiHostUrl}/api/v1/alerts/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        address,
        tokenAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        isEthValidator,
        currency,
        phone: deviceId,
        method: 2,
        userId: getState().auth.userId
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    }

  }
);

export const createCoinbaseAccountOnServer = createActionFn<CreateCoinbaseAccountDto, CoinbaseAccount>(
  // @ts-ignore
  async (_dispatch, getState, { 
    phone,
    accessToken, 
    refreshToken,
    idToken,
    scopes,
    accessTokenExpirationDate
   }: CreateCoinbaseAccountDto): Promise<CoinbaseAccount> => {

    const response = await fetch(`${apiHostUrl}/api/v1/coinbase/authorize/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        phone,
        accessToken, 
        refreshToken,
        idToken,
        scopes,
        accessTokenExpirationDate,
        method: 2,
        userId: getState().auth.userId
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    } 

  }
);

export const hydrateCoinbaseAccount = createActionFn<Account, Account>(
  // @ts-ignore
  async (dispatch, getState, { id }: Account): Promise<Account> => {

    const response = await fetch(`${apiHostUrl}/api/v1/coinbase/accounts/${id}`);

    if (response.ok) {
      try {
        const account = await response.json();
        if (account.length) {
          dispatch(actions.updateAccount(account[0]));
          await setAccounts(getState().auth.accounts);
          return account[0];
        }
      } catch (e) {
        throw new Error('Error hydrating coinbase account');
      }
    } else {
      throw new Error('Error hydrating coinbase account');
    }
  }
);

export const fetchAllowListForUserId = createActionFn<void, Promise<void>>(
  // @ts-ignore
  async (dispatch, getState): Promise<void> => {

    const userId = getState().auth.userId;

    const response = await fetch(`${apiHostUrl}/api/v1/allowlist/${userId}`);

    if (response.ok) {
      const allowListResponse = await response.json();
      dispatch(actions.setAllowList(!!allowListResponse.userIsVIP));
    } else {
      dispatch(actions.setAllowList(false));
      // throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    }
  }
);

export const hydrateLocalAccount = createActionFn<Account, Account>(
  // @ts-ignore
  async (dispatch, getState, account: Account): Promise<Account> => {
      const updatedAccount = await createAccountForDevice(account);
      dispatch(actions.updateAccount(updatedAccount));
      await setAccounts(getState().auth.accounts);
  }
);

export const hydrateServerAccount = createActionFn<Account, Account>(
  // @ts-ignore
  async (dispatch, getState, { id }: Account): Promise<Account> => {

    const response = await fetch(`${apiHostUrl}/api/v1/alerts/${id}`);
    if (response.ok) {
      const account = await response.json();
      if (account.length) {
        dispatch(actions.updateAccount(account[0]));
        await setAccounts(getState().auth.accounts);
        return account[0];
      }
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    } else {
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    }

  }
);

export const addAccount = createActionFn<Account, Promise<Account>>(
  async (dispatch, getState, account) => {
    dispatch(actions.addAccount(account));
    await setAccounts(getState().auth.accounts);
    return account;
  }
);

export const removeAccount = createActionFn<Account, Promise<void>>(
  async (dispatch, getState, account) => {

    dispatch(actions.removeAccount(account));
    await setAccounts(getState().auth.accounts);
    
    if (account.type === AccountTypes.Coinbase) {
      await fetch(`${apiHostUrl}/api/v1/unsubscribe/coinbase/${account.id}/`);
    } else {
      await fetch(`${apiHostUrl}/api/v1/unsubscribe/mobile/${account.id}/`);
    }

    return;
  }
);

export const loadAccounts = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const accounts: Account[] = await getAccounts();
    dispatch(actions.loadAccounts(accounts));
    accounts.map((account) => {
      if (account.type === AccountTypes.Coinbase) {
        dispatch(hydrateCoinbaseAccount(account));
      } else {
        dispatch(hydrateLocalAccount(account));
      }
    });
  }
);

export const subscribeAllAccounts = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const deviceId = _getState().auth.deviceId;
    if (deviceId) {
      const accounts: Account[] = await getAccounts();
      // dispatch(actions.loadAccounts(accounts));
      accounts.map((account, i) => {
        if (account.type !== AccountTypes.Coinbase && i < MAX_ACCOUNTS_PRO_MONITORING) {
          dispatch(createAccountOnServer({ ...account, deviceId }));
        }
      });
    } else {
      throw new Error('Please enable push notifications');
    }
  }
);

export const resetAuthState = createActionFn<void, Promise<void>>(
  async (dispatch, getState) => {
    for (const account of getState().auth.accounts) {
      if (account.type === AccountTypes.Coinbase) {
        await fetch(`${apiHostUrl}/api/v1/unsubscribe/coinbase/${account.id}/`);
      } else {
        await fetch(`${apiHostUrl}/api/v1/unsubscribe/mobile/${account.id}/`);
      }
    }
    resetKeychain();
    dispatch(actions.resetAuthState());
  }
);

export const loadPasscodeEnteredTime = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const time = await getPasscodeEnteredTime();
    dispatch(actions.loadPasscodeEnteredTime(time));
  }
);

export const setPasscodeEnteredTime = createActionFn<number, Promise<void>>(
  async (dispatch, _getState, time) => {
    dispatch(actions.setPasscodeEnteredTime(time));
    await savePasscodeEnteredTime(time);
  }
);

export const setPasscode = createActionFn<string, Promise<void>>(
  async (dispatch, _getState, passcode) => {
    dispatch(actions.setPasscode(passcode));
    await savePasscode(passcode);

    // reset the redux store
    dispatch(loadPasscode());
  }
);

export const setAgreeToTerms = createActionFn<boolean, Promise<void>>(
  async (dispatch, _getState, agree) => {
    await save(AsyncStorageKeys.agreeToTerms, agree);
    dispatch(actions.setAgreeToTerms(agree));
  }
);

export const setDeviceId = createActionFn<string, Promise<void>>(
  async (dispatch, _getState, deviceId) => {
    await save(AsyncStorageKeys.deviceId, deviceId);
    dispatch(actions.setDeviceId(deviceId));
  }
);

export const setUserId = createActionFn<string, Promise<void>>(
  async (dispatch, _getState, userId) => {
    await save(AsyncStorageKeys.userId, userId);
    dispatch(actions.setUserId(userId));
  }
);

export const loadPasscode = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const passcode = await getPasscode();
    dispatch(actions.loadPasscode(passcode));
  }
);

export const loadAgreeToTerms = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const agree = await getAgreeToTerms();
    dispatch(actions.setAgreeToTerms(agree));
  }
);

export const setTrigger = createActionFn<SetTriggerActionPayload, Promise<void>>(
  async (dispatch, getState, { id, trigger }) => {

    const userId = getState().auth.userId;
    const response = await fetch(`${apiHostUrl}/api/v1/alerts/set-trigger/${userId}/${id}/${trigger}`, {
      method: 'PUT'
    });

    if (response.ok) {
      const account = await response.json();
      if (account) {
        dispatch(actions.updateAccount(account));
        await setAccounts(getState().auth.accounts);
        Alert.alert(i18n.t(auth.notificationConfig.successHeader), i18n.t(auth.notificationConfig.successBody))
        return account;
      }
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    } else {
      throw new Error(i18n.t(auth.errors.serverErrorAddingAccount));
    }
    return;
  }
);

export const loadDeviceId = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {
    const deviceId = await getDeviceId();
    dispatch(actions.setDeviceId(deviceId));
  }
);

export const loadUserId = createActionFn<void, Promise<void>>(
  async (dispatch, getState) => {
    const userId = await getUserId();
    if (userId) {
      dispatch(actions.setUserId(userId));
    } else {
      dispatch(setUserId(getState().auth.userId));
    }
  }
);

export const createAccountForDevice = async ({
  id,
  tokenAddress, 
  currency, 
  tokenDecimals, 
  isEthValidator, 
  address,
  deviceId
}: CreateAccountDto | Account) => {
  let tokenName, tokenSymbol;
  if (tokenAddress && currency === 'ETH') {
    ({ tokenName, tokenSymbol } = await getEthTokenInfo(tokenAddress));
  } else if (tokenAddress && currency === 'SIGNA') {
    ({ tokenName, tokenSymbol, tokenDecimals } = await getBurstTokenInfo(tokenAddress, tokenName, tokenSymbol, tokenDecimals));
  }

  if (isEthValidator) {
    tokenDecimals = "9";
  }

  const { transactions, balance, updatedAddress } = await getBalanceAndTransactionsFromBlockchain({
    address,
    currency,
    tokenAddress,
    tokenDecimals,
    isEthValidator,
    deviceId: deviceId || ''
  });

  if (updatedAddress) {
    address = updatedAddress;
  }

  const account = {
    id: id || uuidv4(),
    address,
    lastBalance: balance,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    isEthValidator,
    currency,
    phone: deviceId,
    method: 2,
    transactions,
    status: STATUS.ACTIVE,
    trigger: TRIGGERS.BOTH,
  };
  return account;
}

