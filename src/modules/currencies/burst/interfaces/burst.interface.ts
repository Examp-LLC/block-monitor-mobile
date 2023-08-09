
export interface Trade {
    timestamp: number;
    quantityQNT: string;
    priceNQT: string;
    asset: string;
    askOrder: string;
    bidOrder: string;
    askOrderHeight: number;
    seller: string;
    sellerRS: string;
    buyer: string;
    buyerRS: string;
    block: string;
    height: number;
    tradeType: string;
    name: string;
    decimals: number;
}

export interface BurstGetTradesResponse {
    trades: Trade[];
    requestProcessingTime: number;
}

export interface BurstResponse {
    requestProcessingTime: number;
    transactions: BurstTransaction[]
  }
  
  export interface BurstTransaction {
    senderPublicKey: string;
    signature: string;
    feeNQT: string;
    type: number;
    confirmations: number;
    fullHash: string;
    version: number;
    ecBlockId: string;
    signatureHash: string;
    attachment?: {
      "version.Message"?: number;
      messageIsText?: boolean;
      message?: string
    };
    senderRS: string;
    subtype: number;
    amountNQT: string;
    sender: string;
    recipientRS: string;
    recipient: string;
    ecBlockHeight: number;
    block: string;
    blockTimestamp: number;
    deadline: number;
    transaction: string;
    timestamp: number;
    height: number
  }
  
  