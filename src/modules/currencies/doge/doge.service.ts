
export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
      const data = await fetch(`https://dogechain.info/api/v1/address/balance/${escape(address)}`)
      const { balance }  = await data.json();
      return {
          balance: balance || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching DOGE transactions');
  }
}
