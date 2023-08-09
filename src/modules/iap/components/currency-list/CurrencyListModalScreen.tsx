import React from 'react';
import { Image, SafeAreaView, StyleSheet, View, Platform } from 'react-native';
import { Button, ButtonThemes, ButtonSizes } from '../../../../core/components/base/Button';
import { Text, TextAlign, TextThemes } from '../../../../core/components/base/Text';
import { FullHeightView } from '../../../../core/layout/FullHeightView';
import { Screen } from '../../../../core/layout/Screen';
import { Colors } from '../../../../core/theme/colors';
import { Sizes } from '../../../../core/theme/sizes';
import { logos } from '../../../../assets/images';
import { IAP_TIERS } from './CurrencyListModal';
import { CURRENCIES } from '../../../../../../shared/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { Subscription } from 'react-native-iap';
import { auth } from '../../../auth/translations';
import { i18n } from '../../../../core/i18n';
import Markdown from 'react-native-markdown-renderer';

interface Props {
  goBack: () => void;
}

interface State {
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  header: {
    textAlign: 'center',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  keyboard: {
    flex: 2,
    justifyContent: 'center'
  },
  hint: {
    marginBottom: Sizes.MEDIUM
  },
  bodyText: {
    padding: 10
  },
  logo: {
    width: 200,
    height: 53,
    marginBottom: 20,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  footer: {
    marginBottom: 20
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase'
  },
  heading2: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  heading4: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  text: {
    color: '#ffffff'
  },
  listOrderedItemIcon: {
    color: '#fff',
    marginLeft: 10,
    marginRight: 10,
    ...Platform.select({
      ios: {
        lineHeight: 36,
      },
      android: {
        lineHeight: 30,
      },
    }),
  }
});

export class CurrencyListModalScreen extends React.PureComponent<Props, State> {
  state = {
  };

  render() {

    return (
      <Screen style={styles.view}>
        <ScrollView style={{ width: '100%' }}>
          <FullHeightView withoutPaddings style={{ paddingHorizontal: 15 }}>
            <SafeAreaView>
              <View style={styles.header}>
                <Image source={logos.splash} style={styles.logo} />
                <View style={styles.hint}>
                  <Text color={Colors.WHITE} theme={TextThemes.HEADER} textAlign={TextAlign.CENTER}>
                    {i18n.t(auth.currencyList.header)}
                  </Text>
                </View>
              </View>
              <Markdown style={styles}>{`
Currently, Block Monitor℠ supports the following blockchains:

# Full blockchain support

BTC
DASH
DGB
DIVI
DOGE
ETH (including all ERC20 tokens and ETH2 Validator Staking Support)
GRS
IOTA
LTC
SIGNUM (BURST)
STRAX
SYS
XDAI
XRP

Block Monitor℠ also has a read-only Coinbase integration, so you can securely monitor your Coinbase account balances as well.

# Coinbase supported currencies

AAVE
ALGO
ATOM
BAL
BAND
BAT
BCH
BNT
BSV
BTC
COMP
CVC
DAI
DASH
DNT
EOS
ETC
ETH
FIL
GRT
GNT
KNC
LINK
LOOM
LRC
LTC
MANA
MKR
NMR
NU
OMG
OXT
REN
REP
SNX
USDC
UMA
UNI
WBTC
XLM
XTZ
YFI
ZCH
ZRX

More blockchains are added regularly. To submit your coin for listing, please contact us on Discord or Telegram.
              `}</Markdown>

              <Button theme={ButtonThemes.ACCENT} onPress={() => {
                this.props.goBack();
              }}>
                {i18n.t(auth.purchase.goBack)}
              </Button>
            </SafeAreaView>
          </FullHeightView>
        </ScrollView>
      </Screen>
    );
  }
}
