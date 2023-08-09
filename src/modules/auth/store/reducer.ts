import { Reducer, Account } from '../../../core/interfaces';
import { createReducers } from '../../../core/utils/store';
import { actionTypes } from './actionTypes';
import { uuidv4 } from './utils';

export interface AuthReduxState {
  accounts: Account[];
  userId: string;
  passcodeEnteredTime: number;
  passcode: string;
  agreeToTerms: boolean;
  deviceId?: string;
  userIsOnAllowList: boolean;
}

export const authState = (): AuthReduxState => {
  return {
    accounts: [],
    userId: uuidv4(),
    passcodeEnteredTime: 0,
    passcode: '',
    agreeToTerms: false,
    userIsOnAllowList: false
  };
};

const addAccount: Reducer<AuthReduxState, Account> = (state, action) => {
  const accounts = [ ...state.accounts, action.payload ];
  return {
    ...state,
    accounts
  };
};

const updateAccount: Reducer<AuthReduxState, Account> = (state, action) => {
  const account = action.payload;
  const accounts = state.accounts.map((existingAccount) =>
    existingAccount.id === account.id ?
    { ...existingAccount, ...account } : existingAccount);

  return {
    ...state,
    accounts
  };
};

const removeAccount: Reducer<AuthReduxState, Account> = (state, action) => {
  const accounts = state.accounts.filter((item: Account) => item.id !== action.payload.id);
  return {
    ...state,
    accounts
  };
};

const resetAuthState: Reducer<AuthReduxState, Account> = (_state) => {
  return authState();
};

const loadAccounts: Reducer<AuthReduxState, Account[]> = (state, action) => {
  const accounts = action.payload;
  return {
    ...state,
    accounts
  };
};

const loadPasscodeEnteredTime: Reducer<AuthReduxState, number> = (state, action) => {
  const time = action.payload;
  return {
    ...state,
    passcodeEnteredTime: time
  };
};

const setPasscodeEnteredTime: Reducer<AuthReduxState, number> = (state, action) => {
  const time = action.payload;
  return {
    ...state,
    passcodeEnteredTime: time
  };
};

const setAgreeToTerms: Reducer<AuthReduxState, boolean> = (state, action) => {
  const agree = action.payload;
  return {
    ...state,
    agreeToTerms: agree
  };
};

const setDeviceId: Reducer<AuthReduxState, string> = (state, action) => {
  const deviceId = action.payload;
  return {
    ...state,
    deviceId
  };
};

const setUserId: Reducer<AuthReduxState, string> = (state, action) => {
  const userId = action.payload;
  return {
    ...state,
    userId
  };
};

const setAllowList: Reducer<AuthReduxState, boolean> = (state, action) => {
  const userIsOnAllowList = action.payload;
  return {
    ...state,
    userIsOnAllowList
  };
};

const loadPasscode: Reducer<AuthReduxState, string> = (state, action) => {
  const passcode = action.payload;
  return {
    ...state,
    passcode
  };
};

const reducers = {
  [actionTypes.addAccount]: addAccount,
  [actionTypes.updateAccount]: updateAccount,
  [actionTypes.removeAccount]: removeAccount,
  [actionTypes.loadAccounts]: loadAccounts,
  [actionTypes.loadPasscodeEnteredTime]: loadPasscodeEnteredTime,
  [actionTypes.setPasscodeEnteredTime]: setPasscodeEnteredTime,
  [actionTypes.loadPasscode]: loadPasscode,
  [actionTypes.resetAuthState]: resetAuthState,
  [actionTypes.setAgreeToTerms]: setAgreeToTerms,
  [actionTypes.setDeviceId]: setDeviceId,
  [actionTypes.setUserId]: setUserId,
  [actionTypes.setAllowList]: setAllowList
};

export const auth = createReducers(authState(), reducers);
