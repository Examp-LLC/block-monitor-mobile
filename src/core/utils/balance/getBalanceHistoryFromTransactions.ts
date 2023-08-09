import { getRecipientsAmount } from '@burstjs/core';
import { convertNQTStringToNumber } from '@burstjs/util';
import { BalanceHistoryItem } from './typings';
import { Transaction } from '../../interfaces';

const isOwnTransaction = (accountId: string, transaction: Transaction): boolean => transaction.sender === accountId;

function getRelativeTransactionAmount (accountId: string, transaction: Transaction): number {

  if (isOwnTransaction(accountId, transaction)) {
    const amountBurst = convertNQTStringToNumber(transaction.amount || '0');
    const feeBurst = convertNQTStringToNumber(transaction.fee || '0');
    return -(amountBurst + feeBurst);
  }

  return getRecipientsAmount(accountId, transaction);
}

/**
 * Creates a (reversed) history of balances, i.e. deducing an ordered transaction list from current balance
 * @param accountId The accountId of the related Account
 * @param currentBalance The current balance value in BURST
 * @param transactions The transaction array (assuming most recent transaction on head of list)
 * @return A list with balances per transaction
 */
export function getBalanceHistoryFromTransactions (
  accountId: string,
  currentBalance: number,
  transactions: Transaction[]): BalanceHistoryItem[] {

  let balance = currentBalance;

  return transactions
  .map((t: Transaction) => {
    const relativeAmount = getRelativeTransactionAmount(accountId, t);
    const deducedBalances = {
      timestamp: t.blockTimestamp || Date.now(),
      transactionId: t.transaction || '',
      balance,
      transaction: t
    };
    balance = balance - relativeAmount;
    return deducedBalances;
  });
}
