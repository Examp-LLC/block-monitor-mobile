import { defaultSettings } from '../../../core/environment';
import { createAction, createActionFn } from '../../../core/utils/store';
import { actionTypes } from './actionTypes';
import { PriceType, PriceTypeStrings, GroupedHistoricalPriceInfo, TokenPrices } from './reducer';
import { CURRENCIES, SUBS_ENABLED } from '../../../../../shared/constants';

const actions = {
  selectCurrency: createAction<PriceTypeStrings>(actionTypes.selectCurrency),
  updateHistoricalPriceInfo: createAction<GroupedHistoricalPriceInfo>(actionTypes.updateHistoricalPriceInfo),
  updateTokenPriceInfo: createAction<TokenPrices>(actionTypes.updateTokenPriceInfo),
  failedToUpdateTokenPriceInfo: createAction<void>(actionTypes.failedToUpdateTokenPriceInfo),
  failedToUpdatePriceInfo: createAction<void>(actionTypes.failedToUpdatePriceInfo),
  failedToUpdateHistoricalPriceInfo: createAction<void>(actionTypes.failedToUpdateHistoricalPriceInfo)
};

export const selectCurrency = createActionFn<PriceTypeStrings, Promise<void>>(
  async (dispatch, _getState, currency) => {
    dispatch(actions.selectCurrency(currency));
  }
);

export const loadHistoricalPriceApiData = createActionFn<void, Promise<void>>(
  async (dispatch, _getState) => {

    const prices: GroupedHistoricalPriceInfo = {
      prices: {}
    };

    try {

      const symbols = Object.keys(CURRENCIES);
      const response = await fetch(
        defaultSettings.cryptoCompareURL
        .replace('$CURRENCY', 
          [PriceType.BTC, PriceType.USD].join(','))
        .replace('$SYMBOL', 
          symbols.join(',')))

      const updatedPriceInfo = await response.json();
      if (updatedPriceInfo) {
        prices.prices = updatedPriceInfo;
      }
    } catch (e) {
      dispatch(actions.failedToUpdateHistoricalPriceInfo());
    }

    // xDAI
    try {
      const response = await fetch(
        `https://blockscout.com/xdai/mainnet/api?module=stats&action=coinprice`
      );
      const updatedxDaiPriceInfo = await response.json();
      prices.prices['XDAI'] = {
        USD: updatedxDaiPriceInfo.result.coin_usd,
        BTC: updatedxDaiPriceInfo.result.coin_btc
      }
      
    } catch (e) {
      console.log('failed to fetch prices from blockscout');
    }

    dispatch(actions.updateHistoricalPriceInfo(prices));
  }
);


export const fetchTokenInformation = createActionFn<string[] | void, Promise<void>>(
  async (dispatch, getState, contractAddresses) => {
    const tokenPrices: TokenPrices = getState().priceApi.tokenPriceInfo || {};

    try {

      // contractAddresses can be passed in or fetched from the accounts list
      if (!contractAddresses) {
        contractAddresses = getState().auth.accounts
          .filter(({tokenAddress, currency}) => currency === 'ETH' && tokenAddress && tokenAddress.length)
          .map(({tokenAddress}) => tokenAddress as string);
      }

      if (!contractAddresses.length) return;

      for (const contractAddress of contractAddresses) {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`
        )
  
        const updatedPriceInfo = await response.json();
        if (updatedPriceInfo) {
          tokenPrices[contractAddress] = {
            name: updatedPriceInfo.name,
            symbol: updatedPriceInfo.symbol,
            price: {
              USD: updatedPriceInfo.market_data.current_price.usd,
              BTC: updatedPriceInfo.market_data.current_price.btc
            },
            localization: updatedPriceInfo.localization
          };
        }
      }

      dispatch(actions.updateTokenPriceInfo(tokenPrices));
    } catch (e) {
      dispatch(actions.failedToUpdateTokenPriceInfo());
    }
  }
)

export const fetchBurstTokenInformation = createActionFn<string[] | void, Promise<void>>(
  async (dispatch, getState, contractAddresses) => {
    const tokenPrices: TokenPrices = getState().priceApi.tokenPriceInfo || {};

    try {

      // contractAddresses can be passed in or fetched from the accounts list
      if (!contractAddresses) {
        contractAddresses = getState().auth.accounts
          .filter(({tokenAddress, currency}) => (currency === 'BURST' || currency === 'SIGNA') && tokenAddress && tokenAddress.length)
          .map(({tokenAddress}) => tokenAddress as string);
      }
      if (!contractAddresses.length) return;

      for (const contractAddress of contractAddresses) {
        const response = await fetch(
          `https://canada.signum.network/burst?requestType=getTrades&asset=${contractAddress}&firstIndex=0&lastIndex=0`
        );
        const updatedPriceInfo = await response.json();
      
        const priceInBurst = updatedPriceInfo.trades[0].priceNQT / Math.pow(10, 8-updatedPriceInfo.trades[0].decimals)
        if (updatedPriceInfo) {
          const burstPriceInfo = getState().priceApi?.historicalPriceInfo?.prices['SIGNA'];
      
          if (burstPriceInfo) {
            tokenPrices[contractAddress] = {
              name: updatedPriceInfo.trades[0].name,
              symbol: updatedPriceInfo.trades[0].name,
              price: {
                USD: burstPriceInfo.USD * priceInBurst,
                BTC: burstPriceInfo.BTC * priceInBurst
              },
              decimals: updatedPriceInfo.trades[0].decimals
            };
          }
        }
      }
      dispatch(actions.updateTokenPriceInfo(tokenPrices));
    } catch (e) {
      dispatch(actions.failedToUpdateTokenPriceInfo());
    }
  }
)
