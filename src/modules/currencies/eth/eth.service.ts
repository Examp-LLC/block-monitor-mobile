import { CURRENCIES } from "../../../../../shared/constants";
import { i18n } from "../../../core/i18n";
import { Transaction } from "../../../core/interfaces";
import { auth } from "../../auth/translations";
import { BeaconChainValidatorAPIResponse, EthTransaction, ValidatorData } from "./interfaces/eth.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
    const balance = fetch(`${CURRENCIES.ETH.apiUrl}/api?module=account&action=balance&address=${address}&apikey=${CURRENCIES.ETH.apiKey}`)
    const txs = fetch(`${CURRENCIES.ETH.apiUrl}/api?module=account&action=txlist&limit=100&address=${address}&sort=desc&apikey=${CURRENCIES.ETH.apiKey}`)
    const data = await Promise.all([balance, txs]);
    const ethBalanceResponse = await data[0].json();
    const ethTxResponse = await data[1].json();
    return {
      balance: ethBalanceResponse.result as string || '0',
      transactions: normalize(ethTxResponse.result as EthTransaction[])
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching transactions');
  }
}

export const getTokenAccountTransactionsAndBalance = async (address: string, tokenAddress: string) => {
  try {
    const balanceAndTransactionsResponse = await fetch(`${CURRENCIES.ETH.apiUrl}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${CURRENCIES.ETH.apiKey}`)
    const ethTokenBalanceResponse = await balanceAndTransactionsResponse.json();

    return {
      balance: ethTokenBalanceResponse.result as string || '0',
      transactions: []
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching ETH token transactions');
  }
}

export const getEth2AccountBalance = async (address: string): Promise<ValidatorData> => {
  try {
    const balance = await fetch(`https://beaconcha.in/api/v1/validator/${address}`)
    const eth2BalanceResponse: BeaconChainValidatorAPIResponse = await balance.json();
    if (Array.isArray(eth2BalanceResponse.data)) {
      return eth2BalanceResponse.data[0];
    } else {
      return eth2BalanceResponse.data;
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching ETH2 data');
  }
}



export const normalize = (transactions: EthTransaction[]): Transaction[] => {
  return transactions && transactions.length ? transactions
    .map((transaction) => {
      return {
        id: transaction.hash,
        height: parseFloat(transaction.blockNumber),
        sender: transaction.from,
        recipient: transaction.to,
        amount: transaction.value,
        fee: transaction.gasUsed,
        confirmations: transaction.confirmations,
        block: transaction.blockHash,
        timestamp: transaction.timeStamp
      }
    }) : [];
}


export const getEthTokenInfo = async (tokenAddress: string) => {
  const tokenInfoResponse = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`
  );
  const tokenInfo = await tokenInfoResponse.json();
  if (tokenInfo && tokenInfo.name) {
    return { 
      tokenName: tokenInfo.name, 
      tokenSymbol: tokenInfo.symbol.toUpperCase() 
    };
  } else {
    throw new Error(i18n.t(tokenInfo.error || `Error fetching ETH token info for ${tokenAddress}`));
  }
}