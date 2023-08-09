import { CURRENCIES } from "../../../../../shared/constants";
import { Transaction } from "../../../core/interfaces";
import { XRPTransaction } from "./interfaces/xrp.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
    const balance = fetch(`${CURRENCIES.XRP.apiUrl}/v2/accounts/${address}/balances?currency=XRP`)
    const txs = fetch(`${CURRENCIES.XRP.apiUrl}/v2/accounts/${address}/transactions?type=Payment&result=tesSUCCESS&limit=20`)
    const data = await Promise.all([balance, txs]);
    const balanceResponse = await data[0].json();
    const txResponse = await data[1].json();
    return {
      balance:  balanceResponse.balances.length && 
                balanceResponse.balances[0].value || '0',
      transactions: txResponse.result === 'success' && normalize(txResponse.transactions as XRPTransaction[]) || []
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching XRP transactions');
  }
}

export const normalize = (transactions: XRPTransaction[]): Transaction[] => {
  return transactions && transactions.length ? transactions
    .map((transaction) => {
    return {
      id: transaction.hash,
      height: transaction.ledger_index,
      sender: transaction.tx.Account,
      recipient: transaction.tx.Destination,
      amount: transaction.tx.Amount,
      fee: transaction.tx.Fee,
      block: transaction.tx.LastLedgerSequence?.toString() || '',
      timestamp: new Date(transaction.date).getTime() / 1000
    }
  }) : [];
}
