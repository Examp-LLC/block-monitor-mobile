import { CURRENCY_SYMBOL } from "../../../../../../shared/constants";

export interface UnstoppableResponse {
  addresses: {
    [key in CURRENCY_SYMBOL]: string
  };
  meta: {
    owner: string;
    ttl: number;
  };
}