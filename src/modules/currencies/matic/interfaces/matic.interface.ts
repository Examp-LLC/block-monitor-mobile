export interface MaticTransaction {
    blockNumber: string;
    timeStamp: number;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: number;
}

export interface MaticRootObject {
    status: string;
    message: string;
    result: MaticTransaction[] | number | string;
}