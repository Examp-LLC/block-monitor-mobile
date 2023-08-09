import { CURRENCIES } from "../../../../../shared/constants";

export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
      const data = await fetch(`${CURRENCIES.FIO.apiUrl}/v1/chain/get_fio_balance`, {
        method: 'POST',
        headers: {
            'fio_public_key': address
        }
      })
      const { balance }  = await data.json();
      return {
          balance: balance || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching FIO transactions');
  }
}
