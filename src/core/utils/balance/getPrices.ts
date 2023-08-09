import { CURRENCIES, CURRENCY_SYMBOL } from "../../../../../shared/constants";
import { PriceInfoReduxState } from "../../../modules/price-api/store/reducer";

interface GetPricesPayload {
    priceApi: PriceInfoReduxState;
    lastBalance: string;
    currency: CURRENCY_SYMBOL;
    coinbase: boolean;
    tokenAddress?: string;
    tokenDecimals?: string;
}

export const getPrices = ({
    priceApi,
    lastBalance,
    currency,
    coinbase,
    tokenAddress,
    tokenDecimals
}: GetPricesPayload) => {
    let priceBTC, priceUSD;
    if (currency === 'BURST') currency = 'SIGNA';
    if (tokenAddress) {
        priceBTC = priceApi?.tokenPriceInfo && priceApi?.tokenPriceInfo[tokenAddress]?.price.BTC;
        priceUSD = priceApi?.tokenPriceInfo && priceApi?.tokenPriceInfo[tokenAddress]?.price.USD;
    } else {
        priceBTC = priceApi?.historicalPriceInfo?.prices[currency]?.BTC;
        priceUSD = priceApi?.historicalPriceInfo?.prices[currency]?.USD;
    }
    let divisor = CURRENCIES[currency]?.divisor;
    if (coinbase) {
        divisor = 1;
    // @ts-ignore
    } else if (tokenDecimals || parseFloat(tokenDecimals) === 0) {
        divisor = Math.pow(10, parseFloat(tokenDecimals || '0'));
    }

    const balance = (parseFloat(lastBalance) || 0) / divisor;

    if (!priceBTC || !priceUSD) {
        return {
            balance,
            // priceBTC,
            // priceUSD
        }
    }

    let balanceBTC = (currency === 'BTC') ?
        balance : priceBTC as number * balance;
    
    let balanceUSD = priceUSD as number * balance;

    // IOTA - custom divisor for BTC(?)
    if (currency === 'MIOTA') {
        balanceBTC = priceBTC as number * (balance/1000000); 
        balanceUSD = priceUSD as number * (balance/1000000);
    }

    return {
        balance,
        balanceBTC,
        balanceUSD
    }
}