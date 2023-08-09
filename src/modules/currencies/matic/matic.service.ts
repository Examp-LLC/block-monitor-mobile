import { CURRENCIES } from "../../../../../shared/constants";
import { Transaction } from "../../../core/interfaces";
import { MaticTransaction } from "./interfaces/matic.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
    const balanceObj = fetch(`${CURRENCIES.MATIC.apiUrl}/api?module=account&action=balance&address=${address}&apikey=${CURRENCIES.MATIC.apiKey}`)
    const txs = fetch(`${CURRENCIES.MATIC.apiUrl}/api?module=account&action=txlist&limit=100&address=${address}&sort=desc&apikey=${CURRENCIES.MATIC.apiKey}`)
    const data = await Promise.all([balanceObj, txs]);
    const maticBalanceResponse = await data[0].json();
    const maticTxResponse = await data[1].json();
    const balance = parseInt(maticBalanceResponse.result as string);
    if (isNaN(balance)) {
      throw new Error('Invalid Address');
    }
    return {
      balance: balance.toString(),
      transactions: normalize(maticTxResponse.result as MaticTransaction[])
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching transactions');
  }
}

export const getTokenAccountTransactionsAndBalance = async (address: string, tokenAddress: string) => {
  try {
    const balanceAndTransactionsResponse = await fetch(`${CURRENCIES.MATIC.apiUrl}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${CURRENCIES.MATIC.apiKey}`)
    const maticTokenBalanceResponse = await balanceAndTransactionsResponse.json();

    const balance = parseInt(maticTokenBalanceResponse.result as string);
    if (isNaN(balance)) {
      throw new Error('Invalid Address');
    }
    return {
      balance: balance.toString(),
      transactions: []
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching MATIC token transactions');
  }
}



export const normalize = (transactions: MaticTransaction[]): Transaction[] => {
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
