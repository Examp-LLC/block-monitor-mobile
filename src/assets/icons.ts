// Currently, all of them are exported through advanced export from materialdesignicons.com
// Do not forget about `npm run link` after adding new icons

import { Image, ImageURISource } from "react-native";
import { CURRENCY_SYMBOL } from "../../../shared/constants";

// 120/80/40px
export const tabbarIcons = {
  home: require('./icons/icon_accounts.png'),
  add: require('./icons/icon_add.png'),
  settings: require('./icons/icon_settings.png')
};

export const tabbarIconsHover = {
  home: require('./icons/icon_accounts_blue.png'),
  add: require('./icons/icon_add.png'),
  settings: require('./icons/icon_settings_blue.png')
};

export const actionIcons = {
  del: require('./icons/delete.png'),
  chevronDown: require('./icons/chevron-down.png'),
  chevronRight: require('./icons/chevron-right.png'),
  copy: require('./icons/content-copy.png'),
  plus: require('./icons/icon-plus-big.png')
};

export const transactionIcons = {
  done: require('./icons/check-circle.png'),
  waiting: require('./icons/clock.png'),
  camera: require('./icons/icon_qr.png'),
  copy: require('./icons/content-copy.png'),
  paste: require('./icons/icon_paste.png'),
  sendAll: require('./icons/infinity.png')
};

type CryptoIcons = {
  [key in CURRENCY_SYMBOL | 'Unstoppable' | 'Coinbase' | 'PayID' | 'FIO']: {
    white: ImageURISource;
    icon: ImageURISource;
  };
};

// @ts-ignore - todo: add OXT and other missing icons
// 546 / 250 / 128
export const cryptoIcons: CryptoIcons = {
  ALGO: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/algo.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/algo.png')
  },
  ATOM: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/atom.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/atom.png')
  },
  AVAX: {
    white:require('../../src/assets/icons/icon_avax.png'),
    icon: require('../../src/assets/icons/icon_avax.png')
  },
  BTC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/btc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/btc.png')
  },
  BAL: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/bal.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/bal.png')
  },
  BAND: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/band.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/band.png')
  },
  BNT: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/bnt.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/bnt.png')
  },
  BURST: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/burst.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/burst.png')
  },
  COMP: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/comp.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/comp.png')
  },
  CVC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/cvc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/cvc.png')
  },
  DAI: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/dai.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/dai.png')
  },
  LTC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/ltc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/ltc.png')
  },
  DOGE: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/doge.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/doge.png')
  },
  DGB: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/dgb.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/dgb.png')
  },
  DNT: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/dnt.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/dnt.png')
  },
  XRP: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/xrp.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/xrp.png')
  },
  ETH: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/eth.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/eth.png')
  },
  MIOTA: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/miota.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/miota.png')
  },
  BAT: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/bat.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/bat.png')
  },
  ETC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/etc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/etc.png')
  },
  ZEC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/zec.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/zec.png')
  },
  OMG: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/omg.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/omg.png')
  },
  REP: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/rep.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/rep.png')
  },
  ZRX: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/zrx.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/zrx.png')
  },
  BCH: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/bch.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/bch.png')
  },
  LINK: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/link.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/link.png')
  },
  FIL: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/fil.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/fil.png')
  },
  LRC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/lrc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/lrc.png')
  },
  MANA: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/mana.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/mana.png')
  },
  MATIC: {
    white:require('../../src/assets/icons/icon_matic.png'),
    icon: require('../../src/assets/icons/icon_matic.png')
  },
  MKR: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/mkr.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/mkr.png')
  },
  NMR: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/nmr.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/nmr.png')
  },
  DASH: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/dash.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/dash.png')
  },
  DIVI: {
    white:require('../../src/assets/icons/icon_divi.png'),
    icon: require('../../src/assets/icons/icon_divi.png')
  },
  EOS: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/eos.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/eos.png')
  },
  KNC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/knc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/knc.png')
  },
  OXT: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/oxt.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/oxt.png')
  },
  STRAX: {
    white:require('../../src/assets/icons/icon_strax.png'),
    icon: require('../../src/assets/icons/icon_strax.png')
  },
  GRS: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/grs.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/grs.png')
  },
  SYS: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/sys.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/sys.png')
  },
  REN: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/ren.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/ren.png')
  },
  USDC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/usdc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/usdc.png')
  },
  UMA: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/uma.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/uma.png')
  },
  UNI: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/uni.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/uni.png')
  },
  WBTC: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/wbtc.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/wbtc.png')
  },
  XLM: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/xlm.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/xlm.png')
  },
  XTZ: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/xtz.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/xtz.png')
  },
  YFI: {
    white:require('../../node_modules/cryptocurrency-icons/128/white/yfi.png'),
    icon: require('../../node_modules/cryptocurrency-icons/128/icon/yfi.png')
  },
  XDAI: {
    white:require('../../src/assets/icons/icon_xdai.png'),
    icon: require('../../src/assets/icons/icon_xdai.png')
  },
  Unstoppable: {
    white:require('../../src/assets/icons/icon_unstoppable.png'),
    icon: require('../../src/assets/icons/icon_unstoppable.png')
  },
  Coinbase: {
    white:require('../../src/assets/icons/icon_coinbase.png'),
    icon: require('../../src/assets/icons/icon_coinbase.png')
  },
  PayID: {
    white:require('../../src/assets/icons/icon_payid.png'),
    icon: require('../../src/assets/icons/icon_payid.png')
  },
  FIO: {
    white:require('../../src/assets/icons/icon_fio.png'),
    icon: require('../../src/assets/icons/icon_fio.png')
  },
  SIGNA: {
    white:require('../../src/assets/icons/icon_signum.png'),
    icon: require('../../src/assets/icons/icon_signum.png')
  }
}