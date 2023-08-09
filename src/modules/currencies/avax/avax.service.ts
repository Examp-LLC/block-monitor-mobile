import { CURRENCIES } from "../../../../../shared/constants";
import { i18n } from "../../../core/i18n";
import { Transaction } from "../../../core/interfaces";
import { auth } from "../../auth/translations";
import { BeaconChainValidatorAPIResponse, AvaxTransaction, ValidatorData } from "./interfaces/avax.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
    const balanceObj = fetch(`${CURRENCIES.AVAX.apiUrl}/api?module=account&action=balance&address=${address}&apikey=${CURRENCIES.AVAX.apiKey}`)
    const txs = fetch(`${CURRENCIES.AVAX.apiUrl}/api?module=account&action=txlist&limit=100&address=${address}&sort=desc&apikey=${CURRENCIES.AVAX.apiKey}`)
    const data = await Promise.all([balanceObj, txs]);
    const avaxBalanceResponse = await data[0].json();
    const avaxTxResponse = await data[1].json();
    const balance = parseInt(avaxBalanceResponse.result as string);
    if (isNaN(balance)) {
      throw new Error('Invalid Address');
    }
    return {
      balance: balance.toString(),
      transactions: normalize(avaxTxResponse.result as AvaxTransaction[])
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching transactions');
  }
}

export const getTokenAccountTransactionsAndBalance = async (address: string, tokenAddress: string) => {
  try {
    const balanceAndTransactionsResponse = await fetch(`${CURRENCIES.AVAX.apiUrl}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${CURRENCIES.AVAX.apiKey}`)
    const avaxTokenBalanceResponse = await balanceAndTransactionsResponse.json();

    const balance = parseInt(avaxTokenBalanceResponse.result as string);
    if (isNaN(balance)) {
      throw new Error('Invalid Address');
    }
    return {
      balance: balance.toString(),
      transactions: []
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching AVAX token transactions');
  }
}


export const normalize = (transactions: AvaxTransaction[]): Transaction[] => {
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
