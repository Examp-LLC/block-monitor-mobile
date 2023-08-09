
export interface XRPBalance {
  currency: string;
  value: string;
}

export interface XRPBalanceRootObject {
  result: string;
  ledger_index: number;
  limit: number;
  balances: XRPBalance[];
}

export interface Memo2 {
  MemoType: string;
  MemoFormat: string;
}

export interface Memo {
  Memo: Memo2;
}

export interface Tx {
  TransactionType: string;
  Flags: number;
  Sequence: number;
  LastLedgerSequence: number;
  Amount: string;
  Fee: string;
  SigningPubKey: string;
  TxnSignature: string;
  Account: string;
  Destination: string;
  Memos: Memo[];
}

export interface NewFields {
  Sequence: number;
  Balance: string;
  Account: string;
}

export interface CreatedNode {
  LedgerEntryType: string;
  LedgerIndex: string;
  NewFields: NewFields;
}

export interface PreviousFields {
  Sequence: number;
  Balance: string;
}

export interface FinalFields {
  Flags: number;
  Sequence: number;
  OwnerCount: number;
  Balance: string;
  Account: string;
}

export interface ModifiedNode {
  LedgerEntryType: string;
  PreviousTxnLgrSeq: number;
  PreviousTxnID: string;
  LedgerIndex: string;
  PreviousFields: PreviousFields;
  FinalFields: FinalFields;
}

export interface AffectedNode {
  CreatedNode: CreatedNode;
  ModifiedNode: ModifiedNode;
}

export interface Meta {
  TransactionIndex: number;
  AffectedNodes: AffectedNode[];
  TransactionResult: string;
  delivered_amount: string;
}

export interface XRPTransaction {
  hash: string;
  ledger_index: number;
  date: Date;
  tx: Tx;
  meta: Meta;
}

export interface XRPTransactionsRootObject {
  result: string;
  count: number;
  marker: string;
  transactions: XRPTransaction[];
}


