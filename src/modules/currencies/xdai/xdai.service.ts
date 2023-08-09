
export const getAccountTransactionsAndBalance = async (address: string) => {
  try {
      const data = await fetch(`https://blockscout.com/poa/xdai/api?module=account&action=balancemulti&address=${address}`)
      const { result }  = await data.json();
      return {
          balance: result.length && result[0]?.balance || '',
          transactions: []
      }
  } catch (err) {
      console.error(err);
      throw new Error('Error fetching XDAI transactions');
  }
}
