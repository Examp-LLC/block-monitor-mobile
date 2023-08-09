import { i18n } from "../../../core/i18n";
import { Transaction } from "../../../core/interfaces";
import { auth } from "../../auth/translations";
import { BurstGetTradesResponse, BurstTransaction } from "./interfaces/burst.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
    const balance = fetch(`https://canada.signum.network/burst?requestType=getBalance&account=${escape(address)}`)
    const txs = fetch(`https://canada.signum.network/burst?requestType=getAccountTransactions&account=${escape(address)}`)
    const data = await Promise.all([balance, txs]);
    const burstBalanceResponse = await data[0].json();
    const burstTxResponse = await data[1].json();
    return {
      balance: burstBalanceResponse.balanceNQT as string || '0',
      transactions: normalize(burstTxResponse.transactions as BurstTransaction[])
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching Signum transactions');
  }
}

export const getTokenAccountTransactionsAndBalance = async (address: string, tokenAddress: string) => {
  try {
    const balanceAndTransactionsResponse = await fetch(`https://canada.signum.network/burst?requestType=getAccount&account=${escape(address)}`)
    const { assetBalances, balanceNQT } = await balanceAndTransactionsResponse.json();
    if (balanceNQT) { // make sure this response is valid
      return {
        // @ts-ignore
        balance: assetBalances?.find(({ asset }) => asset === tokenAddress)?.balanceQNT || '0', // not a typo (QNT vs NQT)
        transactions: []
      }
    } else {
      throw new Error('Error fetching Signum token balance');
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error fetching Signum token balance');
  }
}


export const normalize = (transactions: BurstTransaction[]): Transaction[] => {
  return transactions && transactions.length ? transactions
    .map((transaction) => {
    return {
      id: transaction.transaction,
      height: transaction.height,
      sender: transaction.senderRS,
      recipient: transaction.recipientRS,
      amount: transaction.amountNQT,
      fee: transaction.feeNQT,
      type: transaction.type,
      confirmations: transaction.confirmations,
      block: transaction.block,
      timestamp: transaction.timestamp,
      attachment: transaction.attachment
    }
  }) : [];
}


export const getBurstTokenInfo = async (tokenAddress: string, tokenName: any, tokenSymbol: any, tokenDecimals: any) => {
  const tokenInfoResponse = await fetch(
    `https://canada.signum.network/burst?requestType=getTrades&asset=${tokenAddress}&firstIndex=0&lastIndex=0`
  );
  const tokenInfo = await tokenInfoResponse.json();
  if (tokenInfo && tokenInfo.trades && tokenInfo.trades.length) {
    tokenName = tokenInfo.trades[0].name;
    tokenSymbol = tokenName;
    tokenDecimals = tokenInfo.trades[0].decimals.toString();
  } else {
    throw new Error(i18n.t(tokenInfo.error || 'Error fetching burst token info'));
  }
  return { tokenName, tokenSymbol, tokenDecimals };
}