export interface Checksum {
    trytesLength: number;
    value: string;
}

export interface Address {
    balance: number;
    checksum: Checksum;
    keyIndex: number;
    privateKey?: any;
    securityLevel: number;
    spentFrom: boolean;
    trytesLength: number;
    value: string;
}

export interface Reference {
    trytesLength: number;
    value: string;
}

export interface IotaBalanceResponseData {
    addressType: number;
    address: string;
    balance: number;
    dustAllowed: boolean;
}

export interface IotaBalanceResponse {
    data: IotaBalanceResponseData;
}