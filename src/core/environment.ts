import { toNumber, toString } from 'lodash';

// @ts-ignore-next-line WARNING: typescript can't check what we have in .env
// tslint:disable-next-line: max-line-length
import { BLOCKMON_HOST_URL, CMC_HOST_URL, CRYPTOCOMPARE_HOST_URL, DEFAULT_BURST_API_ROOT_URL, DEFAULT_BURST_NODE_HOST, DEFAULT_PASSCODE_TIME, COINBASE_CLIENT_ID, COINBASE_CLIENT_SECRET, DEVELOPMENT } from 'react-native-dotenv';

// So we check it like this
// tslint:disable-next-line: max-line-length
if (!DEFAULT_BURST_API_ROOT_URL || !DEFAULT_BURST_NODE_HOST || !DEFAULT_PASSCODE_TIME || !CMC_HOST_URL || !CRYPTOCOMPARE_HOST_URL || !BLOCKMON_HOST_URL || !COINBASE_CLIENT_ID || !COINBASE_CLIENT_SECRET || !DEVELOPMENT) {
  throw new Error('Incorrect .env config!');
}

export const defaultSettings = {
  nodeHost: toString(DEFAULT_BURST_NODE_HOST),
  apiRootUrl: toString(DEFAULT_BURST_API_ROOT_URL),
  passcodeTime: toNumber(DEFAULT_PASSCODE_TIME),
  coinMarketCapURL: toString(CMC_HOST_URL),
  cryptoCompareURL: toString(CRYPTOCOMPARE_HOST_URL),
  blockMonitorURL: toString(BLOCKMON_HOST_URL),
  coinbaseClientId: toString(COINBASE_CLIENT_ID),
  coinbaseClientSecret: toString(COINBASE_CLIENT_SECRET),
  development: toString(DEVELOPMENT)
};
