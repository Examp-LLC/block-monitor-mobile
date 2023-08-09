export interface AvaxTransaction {
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

export interface AvaxRootObject {
    status: string;
    message: string;
    result: AvaxTransaction[] | number | string;
}

export interface BeaconChainValidatorAPIResponse {
    status: string;
    data: ValidatorData | ValidatorData[];
}

export interface ValidatorData {
    activationeligibilityepoch: number;
    activationepoch: number;
    balance: number;
    effectivebalance: number;
    exitepoch: number;
    lastattestationslot: number;
    name: string;
    pubkey: string;
    slashed: boolean;
    validatorindex: number;
    withdrawableepoch: number;
    withdrawalcredentials: string;
}