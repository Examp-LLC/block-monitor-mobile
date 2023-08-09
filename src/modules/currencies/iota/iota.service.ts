import { CURRENCIES } from "../../../../../shared/constants";
import { IotaBalanceResponse } from "./interfaces/iota.interface";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
      const data = await fetch(`${CURRENCIES.MIOTA.apiUrl}/api/v1/addresses/${escape(address)}`)
      const iotaBalanceResponse: IotaBalanceResponse = await data.json();
      return {
          balance: iotaBalanceResponse?.data.balance.toString() || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching transactions');
  }
}
