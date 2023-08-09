export interface Address {
    paymentNetwork: string;
    environment: string;
    addressDetailsType: string;
    addressDetails: AddressDetails;
}

export interface PayIDResponse {
    addresses: Address[];
    payId: string;
}

export interface AddressDetails {
  address: string;
}
