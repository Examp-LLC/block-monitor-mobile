import { CURRENCY_SYMBOL } from "../../../../shared/constants";
import { Account } from "../interfaces";

export type RootStackParamList = {
  Home: {};
  addAccountStepOne: {};
  addAccountStepTwo: {
    currency: CURRENCY_SYMBOL | 'Unstoppable' | 'PayID' | 'FIO';
    address?: string;
    token?: boolean;
  };
  Settings: {};
  Credits: {};
  Scan: {
    currency: CURRENCY_SYMBOL | 'Unstoppable' | 'PayID' | 'FIO';
    token?: boolean;
  };
  NotificationConfig: {
    id: string;
  }
};