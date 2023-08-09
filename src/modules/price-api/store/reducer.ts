import { Reducer } from '../../../core/interfaces';
import { createReducers } from '../../../core/utils/store';
import { actionTypes } from './actionTypes';
import { CURRENCY_SYMBOL } from '../../../../../shared/constants';
import { merge } from 'lodash';


export interface PriceInfoReduxState {
  historicalPriceInfo?: GroupedHistoricalPriceInfo;
  tokenPriceInfo?: TokenPrices;
  selectedCurrency: PriceTypeStrings;
}

export interface GroupedHistoricalPriceInfo {
  prices: {
    [key in CURRENCY_SYMBOL]?: PairedHistoricalPriceInfo;
  }
}

export interface PairedHistoricalPriceInfo {
  BTC: number;
  USD: number;
}

export type HistoricalPriceTypeStrings = keyof PairedHistoricalPriceInfo;

export interface ConversionType {
  type: string;
  conversionSymbol: string;
}

export enum PriceType {
  BURST = 'BURST',
  BTC = 'BTC',
  USD = 'USD'
}

export type PriceTypeStrings = keyof typeof PriceType;

export interface TokenPrices {
  [key: string]: {
    name: string;
    symbol: string;
    price: PairedHistoricalPriceInfo;
    localization?: {
      [key: string]: string;
    },
    decimals?: string;
  }
}

export const priceApiState = (): PriceInfoReduxState => {
  return {
    selectedCurrency: PriceType.BURST
  };
};

const failedToUpdatePriceInfo: Reducer<PriceInfoReduxState, void> = (state) => {
  return {
    ...state,
    priceInfo: undefined
  };
};

const selectCurrency: Reducer<PriceInfoReduxState, PriceTypeStrings> = (state, action) => {
  const selectedCurrency = action.payload;
  return {
    ...state,
    selectedCurrency
  };
};

const updateHistoricalPriceInfo: Reducer<PriceInfoReduxState, GroupedHistoricalPriceInfo> = (state, action) => {
  const historicalPriceInfo = action.payload;
  return {
    ...state,
    historicalPriceInfo
  };
};

const failedToUpdateHistoricalPriceInfo: Reducer<PriceInfoReduxState, void> = (state) => {
  return {
    ...state,
    historicalPriceInfo: undefined
  };
};

const updateTokenPriceInfo: Reducer<PriceInfoReduxState, TokenPrices> = (state, action) => {
  const tokenPriceInfo = merge(action.payload, state.tokenPriceInfo);

  return {
    ...state,
    tokenPriceInfo
  };
};

const failedToUpdateTokenPriceInfo: Reducer<PriceInfoReduxState, void> = (state) => {
  return {
    ...state,
    tokenPriceInfo: undefined
  };
};

const reducers = {
  [actionTypes.failedToUpdatePriceInfo]: failedToUpdatePriceInfo,
  [actionTypes.selectCurrency]: selectCurrency,
  [actionTypes.updateHistoricalPriceInfo]: updateHistoricalPriceInfo,
  [actionTypes.failedToUpdateHistoricalPriceInfo]: failedToUpdateHistoricalPriceInfo,
  [actionTypes.updateTokenPriceInfo]: updateTokenPriceInfo,
  [actionTypes.failedToUpdateTokenPriceInfo]: failedToUpdateTokenPriceInfo
};

export const priceApi = createReducers(priceApiState(), reducers);
