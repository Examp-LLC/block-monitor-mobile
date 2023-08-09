
export const getAccountTransactionsAndBalance = async (address: string, currency: string) => {
  try {
      const data = await fetch(`http://chainz.cryptoid.info/${currency.toLowerCase()}/api.dws?q=getbalance&key=3211ea31ee24&a=${escape(address)}`)
      const balance: string  = await data.json();
      return {
          balance: balance || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching CryptoID balance');
  }
}
