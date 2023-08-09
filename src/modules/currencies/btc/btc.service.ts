
export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
      const data = await fetch(`https://api.blockchain.com/q/addressbalance/${escape(address)}`)
      const balance: string  = await data.json();
      return {
          balance: balance || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching BTC transactions');
  }
}
