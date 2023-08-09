export interface Address {
    token_code: string;
    chain_code: string;
    public_address: string;
}

export interface Row {
    id: number;
    name: string;
    namehash: string;
    domain: string;
    domainhash: string;
    expiration: number;
    owner_account: string;
    addresses: Address[];
    bundleeligiblecountdown: number;
}

export interface FIOResponse {
    rows: Row[];
    more: boolean;
}
